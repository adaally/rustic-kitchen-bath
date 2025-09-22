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
    mainLink.appendChild(infoBlock);

    secondLink.remove();

    mainLink.classList.add('boost-sd__product-link-wrapper');

    item.classList.add('structure-fixed');
  }
}

function initProductRestructureObserverFinal() {
  const productList = document.querySelector('.boost-sd__product-list');
  if (!productList) {
    console.log("initProductRestructureObserverFinal")
    setTimeout(initProductRestructureObserverFinal, 250);
    return;
  }

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

  // Initial run for items already on the page.
  processItems();

  observer.observe(productList, {
    childList: true,
    subtree: true,
  });
}

// Start the process.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductRestructureObserverFinal);
} else {
  initProductRestructureObserverFinal();
}
