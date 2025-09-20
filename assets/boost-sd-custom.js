
/*********************** Custom JS for Boost AI Search & Discovery  ************************/

function restructureProductItems() {
  const itemsToFix = document.querySelectorAll('.boost-sd__product-item:not(.structure-fixed)');

  itemsToFix.forEach(item => {
    const imageLink = item.querySelector('.boost-sd__product-link-image');
    const detailsContainer = item.querySelector('.boost-sd__product-item-grid-view-layout-details');

    if (!imageLink || !detailsContainer) {
      return;
    }

    const titleLink = detailsContainer.querySelector('.boost-sd__product-link');
    const titleElement = detailsContainer.querySelector('.boost-sd__product-item-title');

    imageLink.appendChild(detailsContainer);

    if (titleLink && titleElement) {

      const newTitleDiv = document.createElement('div');
      newTitleDiv.className = titleLink.className;
      
      newTitleDiv.appendChild(titleElement);
      
      titleLink.parentNode.replaceChild(newTitleDiv, titleLink);
    }
    
    item.classList.add('structure-fixed');
  });
}

function initProductRestructureObserver() {

  const productList = document.querySelector('.boost-sd__product-list');
  if (!productList) {
    setTimeout(initProductRestructureObserver, 250);
    return;
  }

  restructureProductItems();


  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        setTimeout(restructureProductItems, 100);
        break;
      }
    }
  });

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
