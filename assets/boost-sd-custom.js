/*********************** Custom JS for Boost AI Search & Discovery  ************************/

// Test 
console.log('boost-sd-custom.js is loading');

document.addEventListener('DOMContentLoaded', function() {
    console.log('boost-sd-custom.js');
    
    
    setTimeout(function() {
        const productItems = document.querySelectorAll('.boost-sd__product-item');
        console.log(productItems.length, 'boost-sd product items');
        
        const pfsItems = document.querySelectorAll('.boost-pfs-filter-product-item');
        console.log(pfsItems.length, 'boost-pfs product items');
        
        
        alert('boost-sd-custom.js ' + productItems.length + ' SD items and ' + pfsItems.length + ' PFS items');
    }, 2000);
});