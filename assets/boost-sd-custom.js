/*********************** Custom JS for Boost AI Search & Discovery  ************************/

function fixRedundantLinks() {
    document.querySelectorAll('.boost-sd__product-item:not(.fixed)').forEach(function(item) {
        const imageLink = item.querySelector('.boost-sd__product-link-image');
        const titleLink = item.querySelector('a:not(.boost-sd__product-link-image)');
        
        if (imageLink && titleLink) {
            const itemContent = item.cloneNode(true);
            itemContent.querySelectorAll('button[class*="boost-sd__btn"]').forEach(function(button) {
                button.remove();
            });
            
            const wrapper = document.createElement('a');
            wrapper.href = imageLink.href;
            wrapper.className = 'boost-sd__product-link-wrapper';
            wrapper.innerHTML = itemContent.innerHTML; 
            
            const children = Array.from(item.children);
            children.forEach(function(child) {
                if (!child.querySelector('button[class*="boost-sd__btn"]')) {
                    wrapper.appendChild(child);
                }
            });
            
            item.appendChild(wrapper);
            
            wrapper.querySelectorAll('a').forEach(function(link) {
                const div = document.createElement('div');
                div.innerHTML = link.innerHTML;
                div.className = link.className;
                link.parentNode.replaceChild(div, link);
            });
            
            item.querySelectorAll('button[class*="boost-sd__btn"]').forEach(function(button) {
                const targetContainer = wrapper.querySelector('.boost-sd__product-image-row--bottom .boost-sd__product-image-column--in-bottom');
                if (targetContainer) {
                    console.log('Moving React button to wrapper:', button.className);
                    targetContainer.appendChild(button); 
                }
            });
            
            wrapper.querySelectorAll('button[class*="boost-sd__btn"]').forEach(function(button) {
                console.log('Adding event listener to moved React button:', button.className);
                
                button.addEventListener('click', function(e) {
                    console.log('React button clicked, stopping propagation:', button.className);
                    e.stopPropagation();
                });
            });
            
            item.classList.add('fixed');
        }
    });
}

setTimeout(fixRedundantLinks, 1000);

new MutationObserver(function() {
  setTimeout(fixRedundantLinks, 100);
}).observe(document.body, { childList: true, subtree: true });