/*********************** Custom JS for Boost AI Search & Discovery  ************************/

/**
 * Processes a single product item once it's confirmed to be fully rendered.
 * @param {HTMLElement} item The product item element to restructure.
 */
function restructureItem(item) {
  if (item.classList.contains('structure-fixed')) {
    return;
  }

  const imageLink = item.querySelector('.boost-sd__product-link-image');
  const detailsContainer = item.querySelector('.boost-sd__product-item-grid-view-layout-details');

  if (!imageLink || !detailsContainer) {
    console.error('[Boost Fix] Restructure failed unexpectedly after element was confirmed.', item);
    return;
  }

  const titleLink = detailsContainer.querySelector('.boost-sd__product-link');
  const titleElement = detailsContainer.querySelector('.boost-sd__product-item-title');

  imageLink.appendChild(detailsContainer);

  if (titleLink && titleElement && titleLink.parentNode) {
    const newTitleDiv = document.createElement('div');
    newTitleDiv.className = titleLink.className;
    newTitleDiv.appendChild(titleElement);
    titleLink.parentNode.replaceChild(newTitleDiv, titleLink);
  }

  item.classList.add('structure-fixed');
  // console.log('[Boost Fix] Successfully restructured item:', item);
}

/**
 * Waits for a specific product item to be fully rendered by polling for a key inner element.
 * @param {HTMLElement} item The product item's outer shell.
 * @param {number} maxRetries The maximum number of times to check before giving up.
 */
function waitForElementAndProcess(item, maxRetries = 20) {
  if (maxRetries <= 0) {
    console.error('[Boost Fix] Gave up waiting for details container on item:', item);
    return;
  }

  const detailsContainer = item.querySelector('.boost-sd__product-item-grid-view-layout-details');

  if (detailsContainer) {
    restructureItem(item);
  } else {
    setTimeout(() => {
      waitForElementAndProcess(item, maxRetries - 1);
    }, 100); 
  }
}

function initProductRestructureObserver() {
  const productList = document.querySelector('.boost-sd__product-list');
  if (!productList) {
    setTimeout(initProductRestructureObserver, 250);
    return;
  }

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.matches('.boost-sd__product-item')) {
              waitForElementAndProcess(node);
            }
            else {
              const items = node.querySelectorAll('.boost-sd__product-item');
              items.forEach(waitForElementAndProcess);
            }
          }
        });
      }
    }
  });

  const initialItems = productList.querySelectorAll('.boost-sd__product-item');
  initialItems.forEach(waitForElementAndProcess);

  observer.observe(productList, {
    childList: true,
    subtree: true
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductRestructureObserver);
} else {
  initProductRestructureObserver();
}