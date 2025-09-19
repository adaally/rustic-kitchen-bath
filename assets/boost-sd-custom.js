/*********************** Custom JS for Boost AI Search & Discovery  ************************/

function fixRedundantLinks() {
    document.querySelectorAll('.boost-sd__product-item:not(.fixed)').forEach(function(item) {
        const imageLink = item.querySelector('.boost-sd__product-link-image');
        if (imageLink)
            const wrapper = document.createElement('a');
            wrapper.href = imageLink.href;
            wrapper.className = 'boost-sd__product-link-wrapper';

            while (item.firstChild) {
                wrapper.appendChild(item.firstChild);
            }

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

            wrapper.querySelectorAll('button').forEach(function(button) {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
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