/*********************** Custom JS for Boost AI Search & Discovery  ************************/

function fixRedundantLinks() {
  document.querySelectorAll('.boost-sd__product-item:not(.fixed)').forEach(function(item) {
    const imageLink = item.querySelector('.boost-sd__product-link-image');
    const titleLink = item.querySelector('a:not(.boost-sd__product-link-image)');

    if (imageLink && titleLink) {
      const wrapper = document.createElement('a');
      wrapper.href = imageLink.href;
      wrapper.className = 'boost-sd__product-link-wrapper';

      while (item.firstChild) {
        wrapper.appendChild(item.firstChild);
      }

      item.appendChild(wrapper);

      wrapper.querySelectorAll('a').forEach(function(link) {
        if (!link.classList.contains('boost-sd__product-link-wrapper')) {
          const div = document.createElement('div');
          div.innerHTML = link.innerHTML;
          div.className = link.className;
          for (const attr of link.attributes) {
            if (attr.name.startsWith('data-')) {
              div.setAttribute(attr.name, attr.value);
            }
          }
          link.parentNode.replaceChild(div, link);
        }
      });

      wrapper.addEventListener('click', function(e) {
        const isButton = e.target.closest('button, .boost-sd__button');
        if (isButton) {
          e.preventDefault();  
          e.stopPropagation(); 
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
