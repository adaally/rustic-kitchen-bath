/*********************** Custom JS for Boost AI Search & Discovery  ************************/

function fixRedundantLinks() {
    document.querySelectorAll('.boost-sd__product-item:not(.fixed)').forEach(function(item) {
        const imageLink = item.querySelector('.boost-sd__product-link-image');
        const titleLink = item.querySelector('a:not(.boost-sd__product-link-image)');
        
        if (imageLink && titleLink) {
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
            
            item.classList.add('fixed');
            
            setTimeout(function() {
                if (typeof boostPFS !== 'undefined' && boostPFS.init) {
                    boostPFS.init();
                }
                
                if (typeof boostPFS !== 'undefined' && boostPFS.initFilter) {
                    boostPFS.initFilter();
                }
                
                const event = new Event('DOMContentLoaded');
                document.dispatchEvent(event);
            }, 100);
        }
    });
}

setTimeout(fixRedundantLinks, 1000);

new MutationObserver(function() {
  setTimeout(fixRedundantLinks, 100);
}).observe(document.body, { childList: true, subtree: true });