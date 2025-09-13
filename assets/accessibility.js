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
        const FORM_ID = "formGeneratorForm";
        const iframeObserver = new MutationObserver((mutations, obs) => {
            const iframe = document.querySelector(iframeSelector);
            if (iframe) {
            obs.disconnect(); // stop watching once iframe is found

            // Second: wait for iframe to load
            iframe.addEventListener("load", () => {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

                // Third: watch for the form inside the iframe
                const form = iframeDoc.querySelector(`#${FORM_ID}`);
                if (form) {
                    callback(form);
                    return;
                }

                const formObserver = new MutationObserver((mutations, obs2) => {
                    const newForm = iframeDoc.querySelector(`#${FORM_ID}`);
                    if (newForm) {
                        obs2.disconnect();
                        callback(newForm);
                    }
                });

                formObserver.observe(iframeDoc, { childList: true, subtree: true });
            });
            }
        });

        // Start observing the main document for iframe insertion
        iframeObserver.observe(document.body, { childList: true, subtree: true });
    }

    fixFormRealtorProgramRegistration();
});