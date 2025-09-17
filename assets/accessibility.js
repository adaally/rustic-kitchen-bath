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
        onAllChildrenReady("[id^='pin_mfp_']", ".product-title", (parents) => {
            console.log("All inner elements are loaded:", parents);
            parents.forEach((element, index) => {

            });
            document.querySelectorAll("[data-opennt]").forEach((element, index) => {
                const titleModal = parents[index].querySelector(".product-title a");
                element.setAttribute("aria-label", `Open modal for ${titleModal.innerText}`)
            });
        });
});