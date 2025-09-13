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

    function fixFormRealtorProgramRegistration() {

    }

    // fixFormRealtorProgramRegistration();

    function onPxFormReady(callback) {
        const container = document.querySelector(".pxFormGenerator");
        if (!container) {
            console.warn("pxFormGenerator not found");
            return;
        }

        const iframeObserver = new MutationObserver((mutations, obs) => {
            const iframe = container.querySelector("iframe");
            if (iframe) {
            obs.disconnect(); // stop once iframe found

            iframe.addEventListener("load", () => {
                try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                // If the form is already there
                const form = iframeDoc.querySelector("#formGeneratorForm");
                if (form) {
                    callback(form);
                    return;
                }

                // Otherwise watch for it
                const formObserver = new MutationObserver((mutations, obs2) => {
                    const newForm = iframeDoc.querySelector("#formGeneratorForm");
                    if (newForm) {
                    obs2.disconnect();
                    callback(newForm);
                    }
                });

                formObserver.observe(iframeDoc, { childList: true, subtree: true });
                } catch (err) {
                console.error("Cannot access iframe (cross-origin?)", err);
                }
            });
            }
        });

        iframeObserver.observe(container, { childList: true, subtree: true });
        }

        // 👉 Usage
        onPxFormReady((form) => {
            console.log("✅ Form is ready inside iframe:", form);
        });
});