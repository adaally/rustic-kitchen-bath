/*********************** Custom JS for Boost AI Search & Discovery  ************************/

function fixRedundantLinks() {
  document.querySelectorAll('.boost-sd__product-item:not(.fixed)').forEach(function(item) {
    const imageLink = item.querySelector('.boost-sd__product-link-image');
    const titleLink = item.querySelector('a:not(.boost-sd__product-link-image)');

    if (imageLink && titleLink) {
      const wrapper = document.createElement('a');
      wrapper.href = imageLink.href;
      wrapper.className = 'boost-sd__product-link-wrapper';
      wrapper.style.display = "block"; 

      const buttonsContainer = item.querySelector('.boost-sd__product-image-row--bottom');

      while (item.firstChild) {
        wrapper.appendChild(item.firstChild);
      }
      item.appendChild(wrapper);

      if (buttonsContainer) {
        wrapper.querySelector('.boost-sd__product-image-wrapper')?.appendChild(buttonsContainer);
      }

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

      item.querySelectorAll('button').forEach(function(button) {
        button.addEventListener('click', function(e) {
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

