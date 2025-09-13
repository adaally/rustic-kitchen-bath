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
        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
            mutation.addedNodes.forEach((node) => {
                if (node.id === FORM_ID) {
                observer.disconnect(); // stop once found
                callback(node);
                } else if (node.querySelector) {
                const form = node.querySelector(`#${FORM_ID}`);
                if (form) {
                    observer.disconnect();
                    callback(form);
                }
                }
            });
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    fixFormRealtorProgramRegistration();
});