jQuery_T4NT(document).ready(function($) {
  // any code js
});

document.addEventListener('variant:changed', function(event) {
   var variant = event.detail.variant;
   console.log('variant.price',variant.price)
   affirm.ui.ready(
        function() {
            $('.affirm-as-low-as').attr('data-amount',variant.price);
             affirm.ui.refresh();
        }
    );
 });