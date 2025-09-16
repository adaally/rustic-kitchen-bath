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
                    form.querySelectorAll("div").forEach(item => {
                    item.removeAttribute("tabindex");
                    item.removeAttribute("aria-describedby");
                    item.removeAttribute("aria-label");
                });

                form.querySelectorAll("label").forEach(item => {
                    item.removeAttribute("tabindex");
                    item.removeAttribute("aria-label");
                });
                obs.disconnect();
                }, 1000);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    fixBuildCustomKitchenPackageForm();
});