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
                console.log("form added:", node);

                // ✅ Stop observing once the form is found
                observer.disconnect();
            }
            });
        }
        });

        // Watch the whole document (or narrow to a container)
        observer.observe(document.body, { childList: true, subtree: true });
    }

    fixFormRealtorProgramRegistration();
});