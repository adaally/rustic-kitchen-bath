/*********************** Custom JS for Boost AI Search & Discovery  ************************/

function fixRedundantLinks() {
    document.querySelectorAll('.boost-sd__product-item:not(.fixed)').forEach(function(item) {
        const imageLink = item.querySelector('.boost-sd__product-link-image');
        const titleLink = item.querySelector('a:not(.boost-sd__product-link-image)');
        
        if (imageLink && titleLink) {
            const reactButtons = [];
            item.querySelectorAll('button[class*="boost-sd__btn"]').forEach(function(button) {
                reactButtons.push({
                    element: button,
                    parent: button.parentNode
                });
                button.remove();
            });
            
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
                link.parentNode.replaceChild(div, link);
            });
            
            reactButtons.forEach(function(buttonData) {
                const targetContainer = wrapper.querySelector('.boost-sd__product-image-row--bottom .boost-sd__product-image-column--in-bottom');
                if (targetContainer) {
                    buttonData.element.addEventListener('click', function(e) {
                        e.stopPropagation();
                    });
                    targetContainer.appendChild(buttonData.element);
                }
            });
            
            item.classList.add('fixed');
        }
    });
}

setTimeout(fixRedundantLinks, 1000);

new MutationObserver(function() {
  setTimeout(fixRedundantLinks, 100);
}).observe(document.body, { childList: true, subtree: true });