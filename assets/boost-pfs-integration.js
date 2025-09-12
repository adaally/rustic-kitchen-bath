/** Please don't modify or unzip this content. It will be updated regularly **/
    (function() {
      BoostPFS.inject(this);

      //Set global variable
      Globals.hasIntegration = true;
      // 3rd app compile template
      Integration.compileIntegrationTemplate = function (data, itemHtml) {
        var itemReviewsHtml = '';if (Utils.getProductMetafield(data, 'judgeme', 'badge') !== null) {   itemReviewsHtml += "<div class='jdgm-widget jdgm-preview-badge' data-id='" + data.id + "'>" + Utils.getProductMetafield(data, 'judgeme', 'badge') + "</div>";}itemHtml = itemHtml.replace(/{{itemReviews}}/g, itemReviewsHtml);
        return itemHtml;
      };

      Integration.call3rdIntegrationFunc = function(data) {
        
      }

    })();