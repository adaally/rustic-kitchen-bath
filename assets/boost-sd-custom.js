/*********************** Custom JS for Boost AI Search & Discovery  ************************/

// document.addEventListener('DOMContentLoaded', function() {
//     function fixDuplicateLinks() {
//         document.querySelectorAll('.boost-sd__product-item:not(.fixed)').forEach(function(item) {
//             const imageLink = item.querySelector('.boost-sd__product-link-image');
//             const titleLink = item.querySelector('a:not(.boost-sd__product-link-image)');
            
//             if (imageLink && titleLink) {
//                 const wrapper = document.createElement('a');
//                 wrapper.href = imageLink.href;
//                 wrapper.innerHTML = item.innerHTML;
                
//                 item.innerHTML = '';
//                 item.appendChild(wrapper);
                
//                 wrapper.querySelectorAll('a').forEach(function(link) {
//                     const div = document.createElement('div');
//                     div.innerHTML = link.innerHTML;
//                     div.className = link.className;
//                     link.parentNode.replaceChild(div, link);
//                 });
                
//                 item.classList.add('fixed');
//             }
//         });
//     }
    
//     setTimeout(fixDuplicateLinks, 1000);
    
//     new MutationObserver(function() {
//         setTimeout(fixDuplicateLinks, 100);
//     }).observe(document.body, { childList: true, subtree: true });
// });