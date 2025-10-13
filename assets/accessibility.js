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

                //We need to simulate the click to the correct element that is focusable
                element.addEventListener('click', () => {
                    prevSibling.click();
                })
                //Listen when clicked to add focus trap
                prevSibling.addEventListener('click', () => {
                    fixModalProduct(element, prevSibling);
                });
            });
        });

        function fixModalProduct(element, prevSibling) {
            const id = element.getAttribute("data-opennt");
            const container = document.querySelector(id);
            let lazyImg = container.querySelector(".product-image.lazyload");
            if(!lazyImg) {
                lazyImg = container.querySelector(".product-image.lazyloaded");
            }

            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (
                        mutation.type === 'attributes' &&
                        mutation.attributeName === 'class' &&
                        lazyImg.classList.contains('lazyloaded')
                        ) {

                            const modal = container.closest('.mfp-wrap');
                            if(modal) {
                               trapFocus(modal);
                            } else {
                                trapFocus(container);
                            }
                            
                            const stars = container.querySelector('.jdgm-prev-badge__stars');
                            if(stars) {
                                stars.removeAttribute('role');
                                stars.removeAttribute('tabindex');
                            }

                            function handleEsc(event) {
                                if (event.key === "Escape" || event.key === "Esc") {
                                    console.log('scaped')
                                    document.body.click();
                                    setTimeout(() => {
                                        prevSibling.focus();
                                    }, 500);
                                }
                            }
                            document.addEventListener("keydown", handleEsc);
                            observer.disconnect();
                        }
                });
            });
                    
            
            observer.observe(lazyImg, { attributes: true });
        }

        function trapFocus(container, btnOpenModal) {
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

            const offEscape = onEscape(() => {
                if(btnOpenModal) {
                    btnOpenModal.focus();
                }
            });

            function onEscape(handler) {
                function listener(e) {
                    if (e.key === 'Escape' || e.key === 'Esc' || e.code === 'Escape') {
                        handler(e);
                    }
                }
                container.addEventListener('keydown', listener);
                return () => container.removeEventListener('keydown', listener);
            }
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
            if (!window.location.pathname.includes('/collections/') && !window.location.pathname.includes('/search')) return;

            let productList = null;

            function addButtonRoleToGridIcons() {
                const gridViewIndex = 0;
                const btns = document.querySelectorAll('.boost-sd__view-as .boost-sd__view-as-icon');
                btns.forEach((btn, index) => {
                    const isActive = index === gridViewIndex;
                    btn.setAttribute('role', 'button');
                    btn.setAttribute('tabindex', '0');
                    btn.setAttribute('aria-label', isActive ? 'Grid view' : 'List view');
                    btn.setAttribute('aria-pressed', isActive);
                    btn.addEventListener('click', () => {
                        setTimeout(() => {
                            btns.forEach((item) => {
                                item.setAttribute('aria-pressed', item.classList.contains('boost-sd__view-as-icon--active'));
                            });
                        }, 100);
                    });
                });
                document.querySelectorAll('.boost-sd__view-as .boost-sd__tooltip-content').forEach((btn, index) => {
                    btn.setAttribute('aria-hidden', 'true');
                });
            }

            function fixFilterDropdown() {
                const combobox = document.querySelector('.boost-sd__sorting-button');
                const listbox = document.querySelector('.boost-sd__sorting-list');
                if(combobox && listbox) {
                    combobox.setAttribute('role', 'combobox');
                    combobox.setAttribute('aria-haspopup', 'listbox');
                    combobox.setAttribute('aria-expanded', 'false');
                    combobox.setAttribute('aria-owns', 'sort-list');
                    combobox.setAttribute('tabindex', '0');


                    listbox.setAttribute('role', 'listbox');
                    listbox.id = 'sort-list';

                    const options = listbox.querySelectorAll('li');

                    options.forEach(element => element.setAttribute('role', 'option'));

                    const valueSpan = combobox.querySelector('.boost-sd__sorting-value');

                    let isOpen = combobox.getAttribute('aria-expanded') === 'true';
                    let currentIndex = Array.from(options).findIndex(opt => opt.getAttribute('aria-selected') === 'true' || opt.classList.contains('boost-sd__sorting-option--active'));
                    console.log(currentIndex)
                    // if(currentIndex === -1) {

                    // }

                    // Toggle open/close
                    function toggleList(open) {
                        isOpen = open;
                        combobox.setAttribute('aria-expanded', String(open));
                        listbox.style.display = open ? 'block' : 'none';
                        if (open) {
                            options[currentIndex].focus();
                        }
                    }

                    // Update selection
                    function selectOption(index) {
                        options.forEach(opt => opt.removeAttribute('aria-selected'));
                        options[index].setAttribute('aria-selected', 'true');
                        options[index].click();
                        currentIndex = index;
                        valueSpan.textContent = options[index].textContent;
                        toggleList(false);
                    }

                    // Make options focusable
                    options.forEach(opt => opt.setAttribute('tabindex', '-1'));

                    // Handle combobox button click
                    combobox.addEventListener('click', e => {
                        if (e.target.closest('[role="option"]')) return; // let option handler run
                        toggleList(!isOpen);
                    });

                    // Handle keyboard on combobox
                    combobox.addEventListener('keydown', e => {
                        if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            toggleList(true);
                        } else if (isOpen) {
                            switch (e.key) {
                                case 'ArrowDown':
                                    e.preventDefault();
                                    currentIndex = (currentIndex + 1) % options.length;
                                    options[currentIndex].focus();
                                    break;
                                case 'ArrowUp':
                                    e.preventDefault();
                                    currentIndex = (currentIndex - 1 + options.length) % options.length;
                                    options[currentIndex].focus();
                                    break;
                                case 'Enter':
                                case ' ':
                                    e.preventDefault();
                                    selectOption(currentIndex);
                                    break;
                                case 'Escape':
                                    e.preventDefault();
                                    toggleList(false);
                                    break;
                            }
                        }
                    });

                    // Handle clicking on an option
                    options.forEach((opt, index) => {
                        opt.addEventListener('click', () => selectOption(index));
                        opt.addEventListener('keydown', e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            selectOption(index);
                            }
                        });
                    });

                    // Close list if clicked outside
                    document.addEventListener('click', e => {
                        if (!combobox.contains(e.target)) {
                            toggleList(false);
                        }
                    });

                    // Initialize closed
                    toggleList(false);
                }
            }

            function changeProductsCountToH2() {
                const subtitleCount = document.querySelector('.boost-sd__toolbar-item .boost-sd__product-count');
                if(subtitleCount) {
                    subtitleCount.setAttribute('aria-level', '2');
                    subtitleCount.setAttribute('role', 'heading');
                }
            }

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

                const allPageButtons = pagination.querySelectorAll('.boost-sd__pagination-number');
                
                allPageButtons.forEach((button, index) => {
                    const pageNum = parseInt(button.textContent.trim());
                    const isDisabled = button.classList.contains('.boost-sd__pagination-number--disabled');
                    const hasActiveClass = button.classList.contains('boost-sd__pagination-number--active');
                    
                    if (!isNaN(pageNum) && !isDisabled) {
                        const newLabel = `Page ${pageNum}`;
                        button.setAttribute('aria-label', newLabel);
                        button.setAttribute('aria-current', hasActiveClass ? 'true' : 'false');
                    } else {
                        button.setAttribute('aria-hidden', 'true');
                        button.setAttribute('tabindex', '-1');
                    }
                });

                const prevButton = pagination.querySelector('.boost-sd__pagination-button--prev');
                if (prevButton) {
                    prevButton.setAttribute('aria-hidden', 'true');
                    prevButton.setAttribute('tabindex', '-1');
                }

                const nextButton = pagination.querySelector('.boost-sd__pagination-button--next');
                if (nextButton) {
                    nextButton.setAttribute('aria-hidden', 'true');
                    nextButton.setAttribute('tabindex', '-1');
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

                        addButtonRoleToGridIcons();
                        changeProductsCountToH2();
                        fixFilterDropdown();
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

            const cartLink = document.querySelector('.icon_cart a');
            
            cartLink.addEventListener('click', (e) => {
                const overlay = document.querySelector('.mask-overlay');
                if(overlay) {
                    setTimeout(() => {
                        overlay.click();
                        const active = cartCanvas.classList.contains('current_hover');
                        active ? cartCanvas.classList.remove('current_hover') : cartCanvas.classList.add('current_hover');
                        if(!active) {
                            let activeContainer = cartCanvas.querySelector('.mini_cart_wrap:not(.pe_none), .mini_cart_note:not(.pe_none), .mini_cart_dis:not(.pe_none)');
                            console.log(activeContainer)

                            if(activeContainer.classList.contains('mini_cart_wrap')) {
                                activeContainer = activeContainer.querySelector(':scope > div:not(.dn)');
                            }

                            trapFocus(activeContainer, cartLink);
                        }

                    }, 100);
                }
            });

            if (!cartSection || !cartCanvas) {
                return;
            }

            const initialVisible = cartCanvas.classList.contains('current_hover');
            toggleVisibility(cartCanvas, initialVisible);

            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'class') {
                        const cartIsVisible = cartCanvas.classList.contains('current_hover');
                        toggleVisibility(cartCanvas, cartIsVisible);
                    }
                });
            });

            observer.observe(cartCanvas, {
                attributes: true
            });

            function toggleVisibility(cartCanvas, isVisible) {
                isVisible ? cartCanvas.removeAttribute('tabindex') : cartCanvas.setAttribute('tabindex', '-1');
                cartCanvas.querySelectorAll('a[href], input:not([type="hidden"]), select, textarea, button, [tabindex], .mini_cart_dis, .mini_cart_note').forEach(element => {
                    element.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
                    isVisible ? element.removeAttribute('tabindex') : element.setAttribute('tabindex', '-1');
                });
            }
        }
    
    cartWidgetAccessibility();

    function fixPopup1(){
        const observer = new MutationObserver(() => {
            const popup = document.querySelector('.needsclick[role="dialog"] [data-testid="POPUP"]');
            if(!popup) return;

            const title = popup.querySelector('[id^="rich-text"] span');
            if(title) {
                const h1 = document.createElement('h1');
                h1.style.cssText = title.style.cssText;
                h1.textContent = title.textContent;
                title.parentNode.replaceChild(h1, title);
            }
            setTimeout(() =>{
                const emailInput = popup.querySelector('input:not([data-testid="phoneNumberInput"])');
                if (emailInput && emailInput.placeholder) {
                    const currentPlaceholder = emailInput.placeholder;
                    if (!currentPlaceholder.includes('*')) {
                        emailInput.placeholder = currentPlaceholder + ' *';
                    }
                }

                popup.querySelectorAll('a').forEach(element => {
                    element.style.textDecoration = 'underline';
                });
            }, 300);
            const errorObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            const errorMsg = node.querySelector('span[role="alert"]') || (node.matches && node.matches('span[role="alert"]') ? node : null);
                            if (errorMsg) {
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
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    fixPopup1();

    function fixPopupPrivacy() {
        const observer = new MutationObserver(() => {
            const popup = document.querySelector('#shopify-pc__banner');
            if(!popup) return;

            const title = popup.querySelector('#shopify-pc__banner__body-title');
            if(title) {
                const h1 = document.createElement('h1');
                copyAttributes(title, h1);
                h1.innerText = title.innerText;
                title.replaceWith(h1);
            }

            trapFocus(popup);
            observer.disconnect();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    fixPopupPrivacy();

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

    function fixTabListPrudct() {
        const container = document.querySelector('#shopify-section-pr_description');
        if(!container) return;

        const tablist = container.querySelector('[role="tablist"]');
        const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
        const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));

        tabs.forEach(element => {
            const parent = element.parentElement;
            const isActive = parent.classList.contains('active');
            element.setAttribute('tabindex', isActive ? '0' : '-1');
            element.setAttribute('aria-selected', isActive);
        });

        function activateTab(tab) {
            tabs.forEach((t, i) => {
            const selected = t === tab;
            t.setAttribute('aria-selected', selected);
            t.tabIndex = selected ? 0 : -1;
            panels[i].hidden = !selected;
            });
            tab.focus();
        }

        tablist.addEventListener('click', (e) => {
            if (e.target.getAttribute('role') === 'tab') activateTab(e.target);
        });

        tablist.addEventListener('keydown', (e) => {
            const i = tabs.indexOf(document.activeElement);
            if (i === -1) return;

            let next = null;
            switch (e.key) {
            case 'ArrowRight': next = tabs[(i + 1) % tabs.length]; break;
            case 'ArrowLeft':  next = tabs[(i - 1 + tabs.length) % tabs.length]; break;
            case 'Home':       next = tabs[0]; break;
            case 'End':        next = tabs[tabs.length - 1]; break;
            case 'Enter':
            case ' ':          activateTab(tabs[i]); return;
            default: return;
            }
            e.preventDefault();
            next.focus();
        });

        tabs.forEach(t => t.addEventListener('keyup', e => {
            if (e.key === 'Enter') activateTab(e.currentTarget);
        }));
    }

    fixTabListPrudct();

    function fixProductImagesDisplay() {
        const productContainer = document.querySelector('.product');
        if(!productContainer) return;

        const observer = new MutationObserver(() => {
            const btns = productContainer.querySelectorAll('.product-images .n-item');
            if(btns.length === 0) return;

            const openGalleryBtn = productContainer.querySelector('.p_group_btns .show_btn_pr_gallery');
            openGalleryBtn.setAttribute('aria-label', `Open image 1 of ${btns.length} in modal`);
            openGalleryBtn.addEventListener('click', () => fixImageViewModal(openGalleryBtn));
            
            btns.forEach((element, index) => {
                setImageBtnAttributes(element, index, btns.length);
                element.addEventListener('click', () => {
                    openGalleryBtn.setAttribute('aria-label', `Open image ${index+1} of ${btns.length} in modal`)
                });
            });

            const title = productContainer.querySelector('.product_title').innerText;

            productContainer.querySelectorAll('.p-nav, .p-thumb, .flickity-button, .btn_pnav_prev, .btn_pnav_next').forEach(element => {
                element.setAttribute('tabindex', '-1');
                element.setAttribute('aria-hidden', 'true');
            });

            observer.disconnect();
        });

        observer.observe(productContainer, {
            subtree: true,
            childList: true
        });

        function setImageBtnAttributes(element, index, total) {
            if(!element) return;
            element.setAttribute('role', 'button');
            element.setAttribute('tabindex', '0');
            element.setAttribute('image-index', index+1);
            element.setAttribute('aria-label', `Load image ${index+1} of ${total} in gallery view`);
        }

        function fixImageViewModal(openGalleryBtn) {
            setTimeout(() => {
                const modal = document.querySelector('.pswp');
                if(!modal) return;

                modal.querySelectorAll('.pswp__button--arrow--left, .pswp__button--arrow--right').forEach(element => {
                    element.setAttribute('tabindex', '-1');
                    element.setAttribute('aria-hidden', 'true');
                });

                const btnsModal = modal.querySelectorAll('.pswp .pswp__thumbnails .pswp_thumb_item');
                btnsModal.forEach((element, index) => {
                    setImageBtnAttributes(element, index, btnsModal.length);
                });

                const closeBtn = modal.querySelector('.pswp__button--close');
                closeBtn.addEventListener('click', () => {
                    openGalleryBtn.focus();
                });

                modal.querySelectorAll('.pswp__button--close, .pswp__button--share, .pswp__button--fs, .pswp__button--zoom').forEach(element => {
                    element.setAttribute('aria-label', element.getAttribute('title'));
                });

                trapFocus(modal, openGalleryBtn);
            }, 500)
        }
    }

    fixProductImagesDisplay();

    function initMenuAriaExpanded() {
        document.querySelectorAll('.nt_menu .has-children > a').forEach(function(link) {
            const parentLi = link.parentElement;
            
            parentLi.addEventListener('mouseenter', function() {
            link.setAttribute('aria-expanded', 'true');
            });
            
            parentLi.addEventListener('mouseleave', function() {
            link.setAttribute('aria-expanded', 'false');
            });
        });
    }

    function closeMenusOnEscape(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            const nav = document.querySelector('.nt_navigation');
            nav.classList.add('hover-disabled');
            
            document.querySelectorAll('.nt_menu .has-children').forEach(function(item) {
                item.classList.remove('is_hover');
                item.classList.remove('menu_item_hover');
                
                const link = item.querySelector('a');
                if (link) link.setAttribute('aria-expanded', 'false');
            });
            
            function reactivateHover() {
                nav.classList.remove('hover-disabled');
                nav.removeEventListener('mouseleave', reactivateHover);
            }
            
            nav.addEventListener('mouseleave', reactivateHover);
        }
    }
            
    initMenuAriaExpanded();
    document.addEventListener('keydown', closeMenusOnEscape);

    function fixProductSlider() {
        const elements = document.querySelectorAll('.related.product-extra');
        elements.forEach(element => {
            const observer = new MutationObserver(() => {
                const sliderContainer = element.querySelector('.products');
                if(!sliderContainer) return;


                sliderContainer.querySelectorAll('.product').forEach(product => {
                    const observerThumbnail = new MutationObserver(() => {
                        const elements = product.querySelectorAll('a, button, .input-text, [tabindex="0"]');
                        
                        // 2 is the default elements number but there are more that need to load
                        if(elements.length <= 2) return;

                        sliderContainer.removeAttribute('tabindex');

                        sliderContainer.querySelectorAll('.flickity-button').forEach(element => {
                            element.setAttribute('aria-hidden', 'true');
                            element.setAttribute('tabindex', '-1');
                        });

                        updateVisibiliteAttributesForThumbnails(product);

                        observerThumbnail.disconnect();
                    });
                    
                    
                    observerThumbnail.observe(product, {
                        childList: true,
                        subtree: true
                    });
                });
                

                observer.disconnect();
            });

            observer.observe(element, {
                childList: true,
                subtree: true
            });
        });

        function updateVisibiliteAttributesForThumbnails(thumbnail) {
            if(!thumbnail) return;
            const isActive = thumbnail.classList.contains('is-selected');
            console.log(thumbnail.querySelectorAll('.db,.plus,.minus, .nt_add_qv, .input-text, [tabindex="0"]'), 'here')
            thumbnail.querySelectorAll('a, button, .input-text, [tabindex="0"]').forEach(element => {
                element.setAttribute('aria-hidden', isActive? 'false' : 'true');
                element.setAttribute('tabindex', isActive ? '0' : '-1');
            });
        }
    }

    // fixProductSlider(); NEED TO BE FIXED, PRODUCT SLIDER

    function fixBlogList() {
        const blogContainer = document.querySelector('.dib-post-wrap');

        if(!blogContainer) return;

        blogContainer.setAttribute('role', 'list');
        blogContainer.querySelectorAll(':scope > a').forEach(element => {
            const newLink = document.createElement('a');
            newLink.className = element.className;
            newLink.setAttribute('role', 'listitem');

            element.removeAttribute('aria-label');
            const img = element.querySelector('.dib-post-featured-image');
            if(img) {
                img.setAttribute('alt', '');
            }

            const title = element.querySelector('h2');
            if(title) {
                const newTitle = document.createElement('div');
                newTitle.className = title.className;
                newTitle.innerText = title.innerText;
                newTitle.classList.add('h2');
                title.replaceWith(newTitle);
            }

            const listText = element.querySelector('.dib-category-text');

            newLink.appendChild(element);

            
            if(listText && listText.innerText.length > 0) {
                const texts = listText.innerText.split('|');
                listText.innerText = '';
                listText.setAttribute('role', 'list');
                if(title) {
                    listText.setAttribute('aria-label', `${title.innerText} Categories`)
                }
                texts.forEach((text, index) => {
                    const listElement = document.createElement('span');
                    listElement.setAttribute('role', 'listitem');
                    listElement.innerText = text;
                    listElement.classList.add('dib-category-text');
                    listElement.style.display = "inline-block";
                    listText.appendChild(listElement);
                    
                    if(texts.length !== index+1) {
                        const separator = document.createElement('span');
                        separator.setAttribute('aria-hidden', 'true');
                        separator.innerText = '|'
                        separator.style.margin = '0 3px';
                        separator.style.display = "inline-block";
                        separator.classList.add('dib-category-text');
                        listText.appendChild(separator);
                    }

                });
                newLink.appendChild(listText);
            }

            blogContainer.appendChild(newLink);
        });

        const pagination = document.querySelector('.dib-pagination');
        if(pagination) {
            const links = pagination.querySelectorAll('a, .dib-pagination-current');
            const totalPages = links[links.length-1].innerText;
            links.forEach((link) => {
                link.setAttribute('aria-label', `Page ${link.innerText} of ${totalPages}`);
                link.setAttribute('aria-current', link.classList.contains('dib-pagination-current') ? 'true' : 'false');
                if(link.classList.contains('dib-pagination-current')) {
                    link.setAttribute('role', 'link');
                    link.setAttribute('tabindex', '0');
                }
            });

            const paginationNav = document.createElement('nav');
            paginationNav.className = pagination.className;
            paginationNav.innerHTML = pagination.innerHTML;
            pagination.replaceWith(paginationNav);
        }


    }

    fixBlogList();

    function hideHRandBR(){
        document.querySelectorAll('hr, br').forEach(element => {
            element.setAttribute('aria-hidden', 'true');
        });
    }

    hideHRandBR();

    function fixTrackingPage() {
        const trackContainer = document.querySelector('#pp-tracking-page-app');
        if(!trackContainer) return;

        const submitBtn = trackContainer.querySelector('.pp_tracking_form_order .pp_tracking_button button');
        if(submitBtn) {
            submitBtn.addEventListener('click', () => fixErrorTextForInputs('.pp_tracking_form_order'));
        }

        const submitBtn2 = trackContainer.querySelector('.pp_tracking_form_number .pp_tracking_button button');
        if(submitBtn2) {
            submitBtn2.addEventListener('click', () => fixErrorTextForInputs('.pp_tracking_form_number'));
        }

        changeH1toDivAlert();

        const observer = new MutationObserver(() => {
            changeH1toDivAlert();
        });

        observer.observe(trackContainer, {
            subtree: true,
            childList: true
        });

        function changeH1toDivAlert() {
            const notFoundText = document.querySelector('h1.pp_tracking_result_title');
            if(!notFoundText) return;
            const newText = document.createElement('div');
            copyAttributes(notFoundText, newText);
            newText.innerText = notFoundText.innerText;
            newText.setAttribute('role', 'alert');
            notFoundText.replaceWith(newText);
        }

        function fixErrorTextForInputs(containerID) {
            const parents = trackContainer.querySelectorAll(containerID+' .pp_tracking_input:has(.pp_tracking_alert)');
            trackContainer.querySelectorAll(containerID+' .pp_tracking_input .pp_tracking_alert').forEach((element, index) => {
                const input = parents[index].querySelector('input');
                const id = input.getAttribute('name')+"_id";
                element.id = id;
                input.setAttribute('aria-describedby', id);
                if(index === 0) {
                    input.focus();
                }
            });
        }
    }

    fixTrackingPage();

    function fixProductsFilter() {
        const observer = new MutationObserver(() => {
            const filterContent = document.querySelector('.boost-sd__filter-tree-vertical-content');
        
            if(!filterContent) return;

            filterContent.querySelectorAll('.noUi-pips').forEach(element => {
                element.setAttribute('aria-hidden', 'true');
            });

            const handleLower = filterContent.querySelector('.noUi-handle.noUi-handle-lower');
            if(handleLower) {
                handleLower.setAttribute('aria-label', 'Minimum Price');
            }

            const handleHigher = filterContent.querySelector('.noUi-handle.noUi-handle-upper');
            if(handleHigher) {
                handleHigher.setAttribute('aria-label', 'Maximun Price');
            }


            filterContent.querySelectorAll('.boost-sd__filter-option').forEach(element => {
                const filterBtn = element.querySelector('.boost-sd__filter-option-title');
                toggleElementVisibility(filterBtn);
                const obs = new MutationObserver(muts => {
                    for (const m of muts) {
                        if (m.type !== 'attributes' || m.attributeName !== 'class') continue;
                        const filterBtnObs = element.querySelector('.boost-sd__filter-option-title');
                        toggleElementVisibility(filterBtnObs);
                    }
                });
                const collapseContainer = element.querySelector('.boost-sd__filter-option-label');
                obs.observe(collapseContainer, {
                    attributes: true,
                    attributeFilter: ['class'],
                    attributeOldValue: true,
                });

            });

            observer.disconnect();
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true
        });

        function toggleElementVisibility(filterBtn) {
            const parent = filterBtn.parentNode;
            const isClosedContent = parent.classList.contains('boost-sd__filter-option-label--collapsed');
            filterBtn.setAttribute('aria-expanded', isClosedContent ? 'false': 'true');

            const grandParent = parent.parentNode;
            grandParent.querySelectorAll('ul button').forEach(element => {
                element.setAttribute('aria-hidden', isClosedContent ? 'true':'false');
                element.setAttribute('tabindex', isClosedContent ? '-1':'0');
            });

            grandParent.querySelectorAll('ul span').forEach(element => {
                element.setAttribute('aria-hidden', isClosedContent ? 'true':'false');
            });
        }
    }

    fixProductsFilter();


    function copyAttributes(source, target) {
        if (!source || !target) return;

        for (let attr of source.attributes) {
            target.setAttribute(attr.name, attr.value);
        }
    }
});