/*********************** Custom JS for Boost AI Search & Discovery  ************************/

function restructureProductItems() {
  const itemsToFix = document.querySelectorAll('.boost-sd__product-item:not(.structure-fixed)');
  
  if (itemsToFix.length > 0) {
    console.log(`[Boost Fix] Found ${itemsToFix.length} new product items to process.`);
  }

  itemsToFix.forEach((item, index) => {
    const imageLink = item.querySelector('.boost-sd__product-link-image');
    const detailsContainer = item.querySelector('.boost-sd__product-item-grid-view-layout-details');

    if (!imageLink) {
      console.error(`[Boost Fix] Item ${index + 1}: Could not find the image link (.boost-sd__product-link-image). Skipping.`);
      return;
    }
    if (!detailsContainer) {
      console.error(`[Boost Fix] Item ${index + 1}: Could not find the details container (.boost-sd__product-item-grid-view-layout-details). Skipping.`);
      return;
    }

    console.log(`[Boost Fix] Item ${index + 1}: Processing...`);

    const titleLink = detailsContainer.querySelector('.boost-sd__product-link');
    const titleElement = detailsContainer.querySelector('.boost-sd__product-item-title');

    imageLink.appendChild(detailsContainer);

    if (titleLink && titleElement) {
      const newTitleDiv = document.createElement('div');
      newTitleDiv.className = titleLink.className;
      
      newTitleDiv.appendChild(titleElement);
      
      if (titleLink.parentNode) {
        titleLink.parentNode.replaceChild(newTitleDiv, titleLink);
        console.log(`[Boost Fix] Item ${index + 1}: Title link successfully replaced with a div.`);
      } else {
        console.warn(`[Boost Fix] Item ${index + 1}: Could not find parent of titleLink to replace.`);
      }
    } else {
        console.warn(`[Boost Fix] Item ${index + 1}: Title link or title element not found, skipping title replacement.`);
    }
    
    item.classList.add('structure-fixed');
    console.log(`[Boost Fix] Item ${index + 1}: Structure fixed successfully.`);
  });
}

function initProductRestructureObserver() {
  const productList = document.querySelector('.boost-sd__product-list');
  if (!productList) {
    console.log("[Boost Fix] Product list not found yet, retrying in 250ms.");
    setTimeout(initProductRestructureObserver, 250);
    return;
  }

  console.log("[Boost Fix] Product list found. Running initial check and setting up observer.");
  restructureProductItems();

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        setTimeout(restructureProductItems, 150); 
        return; 
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