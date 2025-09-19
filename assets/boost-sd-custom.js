/*********************** Custom JS for Boost AI Search & Discovery  ************************/

/*********************** Custom JS for Boost AI Search & Discovery  ************************/

function fixRedundantLinks() {
    document.querySelectorAll('.boost-sd__product-item:not(.fixed)').forEach(function(item) {
        const imageLink = item.querySelector('.boost-sd__product-link-image');
        const titleLink = item.querySelector('a:not(.boost-sd__product-link-image)');
        
        if (imageLink && titleLink) {
            const buttons = item.querySelectorAll('button');
            const buttonContainer = buttons.length > 0 ? buttons[0].closest('.boost-sd__product-image-column') : null;
            let extractedButtons = null;
            
            if (buttonContainer) {
                extractedButtons = buttonContainer.cloneNode(true);
                buttonContainer.remove();
            }
            
            const wrapper = document.createElement('a');
            wrapper.href = imageLink.href;
            wrapper.className = 'boost-sd__product-link-wrapper';
            wrapper.innerHTML = item.innerHTML;
            
            item.innerHTML = '';
            item.appendChild(wrapper);
            
            wrapper.querySelectorAll('a').forEach(function(link) {
                const div = document.createElement('div');
                div.innerHTML = link.innerHTML;
                div.className = link.className;
                for (const attr of link.attributes) {
                    if (attr.name.startsWith('data-')) {
                        div.setAttribute(attr.name, attr.value);
                    }
                }
                link.parentNode.replaceChild(div, link);
            });
            
            if (extractedButtons) {
                const imageWrapper = wrapper.querySelector('.boost-sd__product-image-wrapper');
                if (imageWrapper) {
                    imageWrapper.style.position = 'relative';
                    extractedButtons.style.position = 'absolute';
                    extractedButtons.style.bottom = '8px';
                    extractedButtons.style.left = '8px';
                    extractedButtons.style.right = '8px';
                    extractedButtons.style.zIndex = '10';
                    imageWrapper.appendChild(extractedButtons);
                }
            }
            
            item.classList.add('fixed');
        }
    });
}

setTimeout(fixRedundantLinks, 1000);

new MutationObserver(function() {
    setTimeout(fixRedundantLinks, 100);
}).observe(document.body, { childList: true, subtree: true });