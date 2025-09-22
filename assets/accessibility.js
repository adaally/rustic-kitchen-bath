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
                prevSibling.setAttribute("aria-label", `Open modal for ${titleModal.innerHTML}`)

                //Listen when clicked to add focus trap
                prevSibling.addEventListener('click', () => {
                    console.log("element clicked")
                    const id = element.getAttribute("data-opennt");
                    const container = document.querySelector(id);
                    const lazyImg = container.querySelector(".product-image.lazyload");

                    const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (
                        mutation.type === 'attributes' &&
                        mutation.attributeName === 'class' &&
                        lazyImg.classList.contains('lazyloaded')
                        ) {
                        console.log('Element finished loading!', getFocusableElements(container));
                        trapFocus(container);
                        observer.disconnect();
                        }
                    });
                    });

                    observer.observe(lazyImg, { attributes: true });

                    
                });
            });
        });

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

        function fixRedundantThumbnailLinks() {
            if (!window.location.pathname.includes('/collections/')) return;

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

            function initBoostObserver() {
                const productList = document.querySelector('.boost-sd__product-list');
                if (!productList) {
                    setTimeout(initBoostObserver, 250);
                    return;
                }

                let observer;
                let processTimeout;

                const processItems = () => {
                    clearTimeout(processTimeout);
                    
                    processTimeout = setTimeout(() => {
                        const itemsToProcess = productList.querySelectorAll('.boost-sd__product-item:not(.structure-fixed)');
                        itemsToProcess.forEach(restructureProductItem);
                        
                        // If no new items appear for 2 seconds, assume we're done
                        setTimeout(() => {
                            const remainingItems = productList.querySelectorAll('.boost-sd__product-item:not(.structure-fixed)');
                            if (remainingItems.length === 0) {
                                observer.disconnect();
                            }
                        }, 2000);
                    }, 250);
                };

                observer = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            processItems();
                            return;
                        }
                    }
                });

                processItems();

                observer.observe(productList, {
                    childList: true,
                    subtree: true,
                });
            }

            initBoostObserver();
        }

        fixRedundantThumbnailLinks();

        function fixThumbnailImageAlts() {
            if (!window.location.pathname.includes('/collections/')) return;

            function clearImageAlts() {
                const productImages = document.querySelectorAll('.boost-sd__product-item .boost-sd__product-image-img');
                productImages.forEach(img => {
                    if (img.alt) {
                        img.alt = '';
                    }
                });
            }

            function initImageAltObserver() {
                const productList = document.querySelector('.boost-sd__product-list');
                if (!productList) {
                    setTimeout(initImageAltObserver, 250);
                    return;
                }

                let observer;
                let processTimeout;

                const processImages = () => {
                    clearTimeout(processTimeout);
                    
                    processTimeout = setTimeout(() => {
                        clearImageAlts();
                        
                        setTimeout(() => {
                            const remainingImages = productList.querySelectorAll('.boost-sd__product-item .boost-sd__product-image-img[alt]:not([alt=""])');
                            if (remainingImages.length === 0) {
                                observer.disconnect();
                            }
                        }, 2000);
                    }, 250);
                };

                observer = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            processImages();
                            return;
                        }
                    }
                });

                processImages();

                observer.observe(productList, {
                    childList: true,
                    subtree: true,
                });
            }

            initImageAltObserver();
        }

        fixThumbnailImageAlts();

});