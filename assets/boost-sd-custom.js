/*********************** Custom JS for Boost AI Search & Discovery  ************************/

function fixRedundantLinks() {
  document.querySelectorAll('.boost-sd__product-item:not(.fixed)').forEach(function(item) {
    const imageLink = item.querySelector('.boost-sd__product-link-image'); 
    const titleLink = item.querySelector('.boost-sd__product-title a');   

    const existingHref = (item.querySelector('a[href]') || {}).href;
    const productHref = existingHref || (imageLink && imageLink.getAttribute('href'));

    if (!imageLink || !productHref) return;

    if (item.querySelector('.boost-sd__product-link-wrapper')) {
      item.classList.add('fixed');
      return;
    }

    const interactiveSelector = [
      'button',
      '.boost-sd__button',
      '.boost-sd__btn-add-to-cart',
      '.boost-sd__btn-quick-view',
      '[data-opennt]',
      '[data-wishlist]'
    ].join(',');
    const buttons = Array.from(item.querySelectorAll(interactiveSelector));

    const wrapper = document.createElement('a');
    wrapper.href = productHref;
    wrapper.className = 'boost-sd__product-link-wrapper';

    const imageContainer = item.querySelector('.boost-sd__product-item-grid-view-layout-image');
    const infoContainer = item.querySelector('.boost-sd__product-info') || item.querySelector('.boost-sd__product-title');

    if (!imageContainer && !infoContainer) return;

    if (imageContainer) wrapper.appendChild(imageContainer);
    if (infoContainer) wrapper.appendChild(infoContainer);

    item.insertBefore(wrapper, item.firstChild);

    buttons.forEach(function(btn) {
      if (wrapper.contains(btn)) {
        item.insertBefore(btn, wrapper.nextSibling);
      }
      btn.addEventListener('click', function(ev) {
        ev.stopPropagation();
      }, { passive: true });
    });

    wrapper.addEventListener('click', function(ev) {
      if (ev.target.closest(interactiveSelector)) {
        ev.preventDefault(); 
      }
    });

    item.classList.add('fixed');
  });
}

setTimeout(fixRedundantLinks, 1000);

new MutationObserver(function() {
  setTimeout(fixRedundantLinks, 100);
}).observe(document.body, { childList: true, subtree: true });
