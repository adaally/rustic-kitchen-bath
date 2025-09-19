/*********************** Custom JS for Boost AI Search & Discovery  ************************/

function fixRedundantLinks(container) {
    const items = container ? container.querySelectorAll('.boost-sd__product-item:not(.fixed)') : document.querySelectorAll('.boost-sd__product-item:not(.fixed)');
    
    items.forEach(function(item) {
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
        }
    });
}

window.__BoostCustomization__ = (window.__BoostCustomization__ ?? []).concat([
    (componentRegistry) => {
        componentRegistry.useComponentPlugin('ProductItem', {
            name: 'Fix Accessibility Links',
            enabled: true,
            apply: () => ({
                afterRender: (element) => {
                    setTimeout(() => fixRedundantLinks(element), 50);
                }
            })
        });
    }
]);

setTimeout(() => fixRedundantLinks(), 1000);

new MutationObserver(function() {
    setTimeout(() => fixRedundantLinks(), 100);
}).observe(document.body, { childList: true, subtree: true });