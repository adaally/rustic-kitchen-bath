document.addEventListener('DOMContentLoaded', () => {
    function renderResponsive() {
        const navBtn = document.querySelector('[data-id="#nt_menu_canvas"]');
        if(!navBtn) return;

        if(window.innerWidth > 1023) {
            const newLinkSpan = document.createElement("span");
            for (const attr of navBtn.attributes) {
                newLinkSpan.setAttribute(attr.name, attr.value);
            }
            newLinkSpan.innerHTML = navBtn.innerHTML;
            navBtn.replaceWith(newLinkSpan);
        }
    }

    // Run on load
    renderResponsive();

    function fixMenuEmptyLink() {
        const items = document.querySelectorAll(".menu-item");
        const menuItems = document.querySelectorAll(".menu-item .lazy_menu.lazyload");

        menuItems.forEach((item, index) => {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                if (mutation.attributeName === "class" && item.classList.contains("lazyloaded")) {

                    const hiddenText = item.querySelector(".banner_hzoom.nt_promotion a.pa .visually-hidden.hidden-text");
                    const title = items[index].querySelector("a.lh__1");
                    if(title) {
                        hiddenText.innerText = title.innerText;
                    }

                    observer.disconnect();
                }
                });
            });

            observer.observe(item, { attributes: true });
        });
    }

    fixMenuEmptyLink();

    function fixBuildCustomKitchenPackageForm() {
        if(!window.location.pathname.endsWith("/build-a-custom-kitchen-package")) return;

        const observer = new MutationObserver((mutation, obs) => {
            const form = document.querySelector("form");
            if(form) {
                setTimeout(() => {
                    form.querySelectorAll("div, label").forEach(item => {
                        item.removeAttribute("tabindex");
                        item.removeAttribute("aria-describedby");
                        item.removeAttribute("aria-label");
                    });

                    const fieldset = form.querySelector(".checkbox-multi");
                    if(fieldset) {
                        
                        fieldset.querySelectorAll("input").forEach(item => {
                            item.style.display = 'block';
                            item.classList.add('visually-hidden');
                        });

                        const firstLabel = fieldset.querySelector(":scope > label");

                        if(firstLabel) {
                            const newLegend = document.createElement("legend");
                            newLegend.className = firstLabel.className;
                            newLegend.innerText = firstLabel.innerText;
                            firstLabel.replaceWith(newLegend);
                        }

                        fieldset.querySelectorAll(".checkbox-list > label").forEach(item => {
                            const span = document.createElement("span");
                            span.className = item.className;

                            while (item.firstChild) {
                                span.appendChild(item.firstChild);
                            }

                            item.replaceWith(span);
                        });
                        
                        
                        const newFieldset = document.createElement("fieldset");
                        newFieldset.className = fieldset.className;

                        while(fieldset.firstChild) {
                            newFieldset.appendChild(fieldset.firstChild);
                        }

                        fieldset.replaceWith(newFieldset);
                    }

                    obs.disconnect();
                }, 2000);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    fixBuildCustomKitchenPackageForm();

    function onAllChildrenReady(parentSelector, childSelector, callback) {
        const parents = document.querySelectorAll(parentSelector);
        const readyParents = new Set();

        parents.forEach(parent => {
            const observer = new MutationObserver(() => {
            if (parent.querySelector(childSelector)) {
                readyParents.add(parent);
                observer.disconnect();

                // if all parents are ready, fire callback
                if (readyParents.size === parents.length) {
                callback(Array.from(readyParents));
                }
            }
            });

            // start observing
            observer.observe(parent, { childList: true, subtree: true });
        });
    }

        // usage
        onAllChildrenReady("[id^='pin_mfp_']", ".product-title a", (parents) => {
            document.querySelectorAll("[data-opennt]").forEach((element, index) => {
                const titleModal = parents[index].querySelector(".product-title a");
                //This is because the element to change is before the current element with ID
                const prevSibling = element.previousElementSibling;
                prevSibling.setAttribute("aria-label", `Open modal for ${titleModal.innerHTML}`);
                element.addEventListener('click', () => {
                    prevSibling.click();
                })
                //Listen when clicked to add focus trap
                prevSibling.addEventListener('click', () => {
                    fixModalProduct(element);
                });
            });
        });

        function fixModalProduct(element) {
            const id = element.getAttribute("data-opennt");
            const container = document.querySelector(id);
            const lazyImg = container.querySelector(".product-image.lazyload");
            if(!lazyImg) return;

            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (
                        mutation.type === 'attributes' &&
                        mutation.attributeName === 'class' &&
                        lazyImg.classList.contains('lazyloaded')
                        ) {
                            
                            trapFocus(container.closest('.mfp-wrap'))
                            const stars = container.querySelector('.jdgm-prev-badge__stars');
                            if(stars) {
                                stars.removeAttribute('role');
                                stars.removeAttribute('tabindex');
                            }

                            function handleEsc(event) {
                                if (event.key === "Escape" || event.key === "Esc") {
                                console.log("Escape pressed: next outside click will close modal");

                                                        function handleOutsideClick(ev) {
                                                            if (!container.contains(ev.target)) {
                                                                console.log("Clicked outside after Escape, closing modal...");
                                                                document.removeEventListener("click", handleOutsideClick);
                                                            }
                                                        }

                                                        // wait for a click outside
                                                        document.addEventListener("click", handleOutsideClick);
                                }
                            }
                            document.addEventListener("keydown", handleEsc);
                            observer.disconnect();
                        }
                });
            });
                    
            
            observer.observe(lazyImg, { attributes: true });
        }

        function trapFocus(container) {
            const focusables = getFocusableElements(container);
            if (focusables.length === 0) return;

            // Focus first element
            focusables[0].focus();

            container.addEventListener('keydown', (e) => {
                if (e.key !== 'Tab') return;

                const first = focusables[0];
                const last = focusables[focusables.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            });
            }

        function getFocusableElements(container) {
            return Array.from(
                container.querySelectorAll(
                    `
                    a[href],
                    button:not([disabled]),
                    input:not([disabled]),
                    select:not([disabled]),
                    textarea:not([disabled]),
                    [tabindex]:not([tabindex="-1"])
                    `
                )
            );
        }

      function fixThumbnailAccessibility() {
            if (!window.location.pathname.includes('/collections/')) return;

            let productList = null;

            function getProductList() {
                if (!productList) {
                    productList = document.querySelector('.boost-sd__product-list');
                }
                return productList;
            }

            function restructureProductItem(item) {
                if (item.classList.contains('structure-fixed')) {
                    return;
                }

                const mainLink = item.querySelector('.boost-sd__product-link-image');
                const secondLink = item.querySelector('a:not(.boost-sd__product-link-image)');
                const infoBlock = secondLink ? secondLink.querySelector('.boost-sd__product-info') : null;

                if (mainLink && secondLink && infoBlock) {
                    mainLink.appendChild(infoBlock);
                    secondLink.remove();
                    mainLink.classList.add('boost-sd__product-link-wrapper');
                    item.classList.add('structure-fixed');
                }
            }

            function clearImageAlts() {
                const productImages = document.querySelectorAll('.boost-sd__product-item .boost-sd__product-image-img[alt]:not([alt=""])');
                productImages.forEach(img => {
                    img.alt = '';
                });
            }

            function addAccessibilityRoles() {
                const list = getProductList();
                if (list && !list.hasAttribute('role')) {
                    list.setAttribute('role', 'list');
                    list.setAttribute('aria-label', getCollectionName());
                }

                const productItems = document.querySelectorAll('.boost-sd__product-item:not([role])');
                productItems.forEach(item => {
                    item.setAttribute('role', 'listitem');
                });
            }

            function addQuickViewLabels() {
                const quickViewButtons = document.querySelectorAll('.boost-sd__btn-quick-view:not([aria-label])');
                quickViewButtons.forEach(button => {
                    button.setAttribute('aria-label', 'Quick view');
                });
            }

            function addPaginationLabels() {
                const pagination = document.querySelector('.boost-sd__pagination');
                if (!pagination) return;

                const activePage = pagination.querySelector('.boost-sd__pagination-number--active');
                const currentPageNumber = activePage ? parseInt(activePage.textContent.trim()) : 1;

                const allPageButtons = pagination.querySelectorAll('.boost-sd__pagination-number:not(.boost-sd__pagination-number--disabled)');
                
                allPageButtons.forEach((button, index) => {
                    const pageNum = parseInt(button.textContent.trim());
                    const hasActiveClass = button.classList.contains('boost-sd__pagination-number--active');
                    
                    if (!isNaN(pageNum)) {
                        if (button.classList.contains('boost-sd__pagination-number--active')) {
                            const newLabel = `Current page, page ${pageNum}`;
                            button.setAttribute('aria-label', newLabel);
                        } else {
                            const newLabel = `Go to page ${pageNum}`;
                            button.setAttribute('aria-label', newLabel);
                        }
                    }
                });

                const prevButton = pagination.querySelector('.boost-sd__pagination-button--prev');
                if (prevButton) {
                    const prevPageNumber = currentPageNumber - 1;
                    prevButton.setAttribute('aria-label', `Go to page ${prevPageNumber}`);
                }

                const nextButton = pagination.querySelector('.boost-sd__pagination-button--next');
                if (nextButton) {
                    const nextPageNumber = currentPageNumber + 1;
                    nextButton.setAttribute('aria-label', `Go to page ${nextPageNumber}`);
                }

                if (!pagination.hasAttribute('role')) {
                    pagination.setAttribute('role', 'navigation');
                    pagination.setAttribute('aria-label', 'Pagination');
                }
                
            }

            function getCollectionName() {
                const h1Element = document.querySelector('.boost-sd__header-title');
                if (h1Element && h1Element.textContent.trim()) {
                    const collectionName = h1Element.textContent.trim();
                    return `${collectionName}'s collection`;
                }
                return "Products collection";
            }

            function isProductProcessingComplete() {
                const list = getProductList();
                if (!list) return false;

                const unprocessedItems = list.querySelectorAll('.boost-sd__product-item:not(.structure-fixed)');
                const imagesWithAlt = list.querySelectorAll('.boost-sd__product-item .boost-sd__product-image-img[alt]:not([alt=""])');
                const itemsWithoutRole = list.querySelectorAll('.boost-sd__product-item:not([role])');
                const buttonsWithoutLabel = list.querySelectorAll('.boost-sd__btn-quick-view:not([aria-label])');

                return unprocessedItems.length === 0 && 
                    imagesWithAlt.length === 0 && 
                    itemsWithoutRole.length === 0 && 
                    buttonsWithoutLabel.length === 0;
            }

            function initAccessibilityObserver() {
                const list = getProductList();
                if (!list) {
                    setTimeout(initAccessibilityObserver, 250);
                    return;
                }

                let productObserver;
                let paginationObserver;
                let processTimeout;

                const processProductChanges = () => {
                    clearTimeout(processTimeout);
                    
                    processTimeout = setTimeout(() => {
                        
                        const itemsToProcess = document.querySelectorAll('.boost-sd__product-item:not(.structure-fixed)');
                        itemsToProcess.forEach(restructureProductItem);

                        clearImageAlts();
                        addAccessibilityRoles();
                        addQuickViewLabels();
                        
                        setTimeout(() => {
                            if (isProductProcessingComplete()) {
                                productObserver.disconnect();
                            }
                        }, 2000);
                    }, 250);
                };

                const processPaginationChanges = () => {
                    addPaginationLabels();
                };

                // Product observer
                productObserver = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList' || mutation.type === 'attributes') {
                            processProductChanges();
                            return;
                        }
                    }
                });

                // Pagination observer
                paginationObserver = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList' || mutation.type === 'attributes') {
                            processPaginationChanges();
                            return;
                        }
                    }
                });

                // Start product processing
                processProductChanges();

                // Observe product list
                productObserver.observe(list, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class']
                });

                // Observe pagination permanently
                const pagination = document.querySelector('.boost-sd__pagination');
                if (pagination) {
                    processPaginationChanges();
                    paginationObserver.observe(pagination, {
                        childList: true,
                        subtree: true,
                        attributes: true,
                        attributeFilter: ['class']
                    });
                }
            }

            initAccessibilityObserver();
        }

        fixThumbnailAccessibility();

        function cartWidgetAccessibility() {
            const cartSection = document.getElementById('shopify-section-cart_widget');
            const cartCanvas = document.getElementById('nt_cart_canvas');

            if (!cartSection || !cartCanvas) {
                return;
            }

            const initialVisible = cartCanvas.classList.contains('current_hover');
            if (initialVisible) {
                cartSection.removeAttribute('tabindex');
            } else {
                cartSection.setAttribute('tabindex', '-1');
            }
            cartSection.setAttribute('aria-hidden', !initialVisible);

            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'class') {
                        const cartIsVisible = cartCanvas.classList.contains('current_hover');
                        if (cartIsVisible) {
                            cartSection.removeAttribute('tabindex');
                        } else {
                            cartSection.setAttribute('tabindex', '-1');
                        }
                        cartSection.setAttribute('aria-hidden', !cartIsVisible);
                    }
                });
            });

            observer.observe(cartCanvas, {
                attributes: true
            });
        }
    
        cartWidgetAccessibility();

       function fixSeptemberSavingsAccessibility() {
            let observer;
            let processTimeout;

            function applySeptemberSavingsAccessibility(popup) {
                const septemberTitle = popup.querySelector('span[style*="font-size: 47px"]');
                if (septemberTitle && septemberTitle.textContent.includes('SEPTEMBER SAVINGS')) {
                    const h1 = document.createElement('h1');
                    h1.style.cssText = septemberTitle.style.cssText;
                    h1.style.whiteSpace = 'nowrap';
                    h1.textContent = septemberTitle.textContent;
                    septemberTitle.parentNode.replaceChild(h1, septemberTitle);
                }

                const emailInput = popup.querySelector('input[type="email"]');
                if (emailInput && emailInput.placeholder) {
                    const currentPlaceholder = emailInput.placeholder;
                    if (!currentPlaceholder.includes('*')) {
                        emailInput.placeholder = currentPlaceholder + ' *';
                    }
                }

                const errorMessage = popup.querySelector('span[role="alert"]');
                if (errorMessage && errorMessage.textContent.includes('This email is invalid')) {
                    errorMessage.textContent = 'Enter an email address in the format example@example.com';
                }

                const errorObserver = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) {
                                const errorMsg = node.querySelector('span[role="alert"]') ||
                                            (node.matches && node.matches('span[role="alert"]') ? node : null);
                                if (errorMsg && errorMsg.textContent.includes('This email is invalid')) {
                                    errorMsg.textContent = 'Enter an email address in the format example@example.com';
                                }
                            }
                        });
                    });
                });

                errorObserver.observe(popup, {
                    childList: true,
                    subtree: true
                });
            }

            function processPopupChanges() {
                clearTimeout(processTimeout);
                processTimeout = setTimeout(() => {
                    const popup = document.querySelector('[data-testid="POPUP"]');
                    if (popup && popup.textContent.includes('SEPTEMBER SAVINGS')) {
                        applySeptemberSavingsAccessibility(popup);
                        if (observer) {
                            observer.disconnect();
                        }
                    }
                }, 250);
            }

            observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) {
                                const popup = node.querySelector && node.querySelector('[data-testid="POPUP"]');
                                if (popup && popup.textContent.includes('SEPTEMBER SAVINGS')) {
                                    processPopupChanges();
                                    return;
                                }
                                if (node.matches && node.matches('[data-testid="POPUP"]') &&
                                    node.textContent.includes('SEPTEMBER SAVINGS')) {
                                    processPopupChanges();
                                    return;
                                }
                            }
                        });
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                const existingPopup = document.querySelector('[data-testid="POPUP"]');
                if (existingPopup && existingPopup.textContent.includes('SEPTEMBER SAVINGS')) {
                    applySeptemberSavingsAccessibility(existingPopup);
                }
            }, 1000);
        }

    fixSeptemberSavingsAccessibility();

    function fixKlaviyoNewsletterTabOrder() {

        function setupErrorMessages(form) {
            const errorMessage = form.querySelector('.shopify-error.error_message');

            // Create checkbox error message if it doesn't exist
            let checkboxError = form.querySelector('.checkbox-error-message');
            if (!checkboxError) {
                checkboxError = document.createElement('span');
                checkboxError.className = 'checkbox-error-message';
                checkboxError.style.cssText = 'color: #ffffff; font-size: 12px; margin-left: 8px; display: none;';
                checkboxError.textContent = 'This field is required';

                const checkboxLabel = form.querySelector('label[for*="new_check_agree"]');
                if (checkboxLabel) {
                    checkboxLabel.appendChild(checkboxError);
                }
            }

            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {

                        // Handle error_css_email
                        if (form.classList.contains('error_css_email')) {
                            if (errorMessage) {
                                errorMessage.textContent = 'Enter an email address in the format example@example.com';
                                errorMessage.classList.remove('dn');
                            }
                        } else if (errorMessage) {
                            errorMessage.classList.add('dn');
                        }

                        // Handle error_css_checkbox
                        if (form.classList.contains('error_css_checkbox')) {
                            if (checkboxError) {
                                checkboxError.style.display = 'inline';
                            }
                        } else if (checkboxError) {
                            checkboxError.style.display = 'none';
                        }
                    }
                });
            });

            observer.observe(form, {
                attributes: true,
                attributeFilter: ['class']
            });
        }

        const existingForms = document.querySelectorAll('footer form.klaviyo_sub_frm');
        existingForms.forEach(form => {
            setupErrorMessages(form);
        });

        // Observer for dynamic Klaviyo forms in footer
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const form = node.querySelector && node.querySelector('footer form.klaviyo_sub_frm');
                        if (form) {
                            setupErrorMessages(form);
                        }
                        if (node.matches && node.matches('footer form.klaviyo_sub_frm')) {
                            setupErrorMessages(node);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    fixKlaviyoNewsletterTabOrder();

});