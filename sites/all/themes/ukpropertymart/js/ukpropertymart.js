(function ($) {

  Drupal.RealEstast = Drupal.RealEstast || {};

  Drupal.behaviors.actionRealEstast = {
    attach: function (context) {
      if($('.btn-btt').length) {
        $('.btn-btt').smoothScroll({speed: 600});
      }
      Drupal.RealEstast.placeholder($("#search-block-form input[name='search_block_form']"), Drupal.t('Keywords'));
      $('select[name="field_business_type_tid"]').children('[value="All"]').html(Drupal.t('Business Type'));
      $('select[name="field_location_tid"]').children('[value="All"]').html(Drupal.t('Location'));
      $('select[name="field_property_type_tid"]').children('[value="All"]').html(Drupal.t('Property Type'));

      Drupal.RealEstast.placeholder($('input[name="field_lot_area_value"]'), Drupal.t('Area From'));
      Drupal.RealEstast.placeholder($('input[name="field_price_value"]'), Drupal.t('Min Price'));
      Drupal.RealEstast.placeholder($('input[name="field_price_value_1"]'), Drupal.t('Max Price'));
      Drupal.RealEstast.placeholder($('.block-simplenews input[name="mail"]'), 'user@example.com');

      $('select[name="field_bedrooms_tid"]').children('[value="All"]').html( Drupal.t('Bedrooms') );
      $('select[name="field_bathrooms_tid"]').children('[value="All"]').html( Drupal.t('Bathrooms') );
      $('.region-content-action .views-exposed-form .views-submit-button input').val(Drupal.t("Apply"));

      $(".view a.accordion-toggle[href='#collapse0']").trigger("click");
      Drupal.RealEstast.flexsliderWithNav();
      Drupal.RealEstast.animationOnScroll();
      Drupal.RealEstast.createdDate();

      if ($(window).width() <= 991) {
        $('#main-menu-inner .region-main-menu').accordionMenu();
      }
      $(window).resize(function(){
        if ($(window).width() <= 991) {
          $('#main-menu-inner .region-main-menu').accordionMenu();
        }
      });


      $("#menu-toggle, .btn-close").click(function(e) {

        var wrapper = $("#page");
        if (!wrapper.hasClass('toggled')) {
          wrapper.addClass('toggled');
          if (wrapper.find('.overlay').length == 0) {
            var overlay = $('<div class="overlay"></div>');
            overlay.prependTo(wrapper);
            overlay.click(function() {
              $('#menu-toggle').trigger('click');
            });
            $('body').css('overflow', 'hidden');
          }

        }
        else {
          var overlay = wrapper.find('.overlay');
          wrapper.css('width', '');
          wrapper.removeClass('toggled');

          if (overlay.length > 0) {
            overlay.remove();
            $('body').css('overflow', '');
          }
        }
        e.preventDefault();
        return false;
      });
    }
  };

  Drupal.RealEstast.getGridSize = function() {
    return (window.innerWidth < 640) ? 2 :
    (window.innerWidth < 1280) ? 3 : 4;
  }

  Drupal.RealEstast.flexsliderWithNav = function () {
    var mainSlider = $("#content .node .flexslider:first");
    if (mainSlider.length) {
      var $window = $(window), flexslider;
      var flexsliderContent = mainSlider.html();
      var mainSliderId =  $("#content .flexslider:first").attr('id');

      var navigationId = "carousel-thumb";
      var navigation = $("<div class='flexslider'></div>").html(flexsliderContent);
      navigation.attr("id", navigationId);
      mainSlider.after(navigation);

      $('#' + navigationId).flexslider({
        animation: "slide",
        controlNav: false,
        directionNav: false,
        animationLoop: true,
        slideshow: false,
        itemWidth: 190,
        maxItems: Drupal.RealEstast.getGridSize(),
        minItems: Drupal.RealEstast.getGridSize(),
        asNavFor: "#" + mainSliderId,
        start: function(slider){
          flexslider = slider;
        }
      });

      $window.resize(function(){
        if (flexslider) {
          var gridSize = Drupal.RealEstast.getGridSize();
          flexslider.vars.minItems = gridSize;
          flexslider.vars.maxItems = gridSize;
        }
      });
    }
  }

  Drupal.RealEstast.animationOnScroll = function() {
    if($(window).width() > 991) {
      var waypointClass = '.animation';

      var bodyClass = $("body").attr("class");
      var match = bodyClass.match(/animation-([a-zA-Z])+/g);
      var animationClass = "none";

      if (match !== null) {
        animationClass = match[0].replace("animation-", "");
      }

      if (animationClass !== "none") {
        var delayTime;

        $(waypointClass).css({opacity: '0'});

        $(waypointClass).waypoint(function() {
          delayTime += 100;
          $(this).delay(delayTime).queue(function(next){
            $(this).addClass('animated');
            $(this).addClass(animationClass);
            delayTime = 0;
            next();
          });
        },
        {
          offset: '80%',
          triggerOnce: true
        });
      }
    }
  }

  Drupal.RealEstast.placeholder = function(element, string) {
    if($(element).val() === "") {
      $(element).val(string);
    }
    $(element).focus(function() {
      if($(this).val() === string) {
        $(this).val("");
      }
    }).blur(function() {
      if($(this).val() === "") {
        $(this).val(string);
      }
    });
    $(element).closest('form').submit(function() {
      if($(element).val() === string) {
        $(element).val("");
      }
    });
  }

  Drupal.RealEstast.createdDate = function() {
    $('.created-date').each(function(){
      var date = $('.field-content', this);
      if (date.length) {
        date = date.text().replace(',', '');
        var day = date.substr(0, 2);
        var month = date.substr(2, date.length);
        date = '<span class="day">' + day.trim() + '</span>';
        date += '<span class="month">' + month.trim() + '</span>';
        $(this).html(date);
      }
    });
  }

})(jQuery);
