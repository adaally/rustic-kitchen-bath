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
        const items = document.querySelectorAll(".lazy_menu.lazyload");

        items.forEach(item => {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                if (mutation.attributeName === "class" && item.classList.contains("lazyloaded")) {
                    // ✅ Your method here

                    const hiddenText = item.querySelector(".banner_hzoom.nt_promotion a.pa .visually-hidden.hidden-text");
                    const title = item.closest(".lh__1");
                    console.log(title, "title")
                    console.log(hiddenText, "hiddentext")
                    if(title) {
                        hiddenText.innerText = title.innerText;
                    }

                    // Optional: stop observing once it's done
                    observer.disconnect();
                }
                });
            });

        observer.observe(item, { attributes: true });
        });
    }

    fixMenuEmptyLink();
});