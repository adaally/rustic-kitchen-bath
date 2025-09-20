/*********************** Custom JS for Boost AI Search & Discovery  ************************/

/**
 * Processes a single product item to fix its link structure.
 * @param {HTMLElement} item The product item element to restructure.
 */
function restructureItemFinal(item) {
  if (item.classList.contains('structure-fixed')) {
    return;
  }

  const mainLink = item.querySelector('.boost-sd__product-link-image');
  const secondLink = item.querySelector('a:not(.boost-sd__product-link-image)');
  const infoBlock = secondLink ? secondLink.querySelector('.boost-sd__product-info') : null;

  if (mainLink && secondLink && infoBlock) {
    console.log('[Boost Fix v5] All elements found. Restructuring item:', item);

    mainLink.appendChild(infoBlock);

    secondLink.remove();

    item.classList.add('structure-fixed');
  } else {
    if (!item.querySelector('.boost-sd__product-link-image')) console.warn('[Boost Fix v5] Main link not found');
    if (!item.querySelector('a:not(.boost-sd__product-link-image)')) console.warn('[Boost Fix v5] Second link not found');
  }
}

function initProductRestructureObserverFinal() {
  const productList = document.querySelector('.boost-sd__product-list');
  if (!productList) {
    setTimeout(initProductRestructureObserverFinal, 250);
    return;
  }

  console.log('[Boost Fix v5] Observer initialized.');

  const processItems = () => {
    const itemsToProcess = productList.querySelectorAll('.boost-sd__product-item:not(.structure-fixed)');
    itemsToProcess.forEach(restructureItemFinal);
  };

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            setTimeout(processItems, 250);
            return; 
        }
    }
  });

  processItems();

  observer.observe(productList, {
    childList: true,
    subtree: true
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductRestructureObserverFinal);
} else {
  initProductRestructureObserverFinal();
}