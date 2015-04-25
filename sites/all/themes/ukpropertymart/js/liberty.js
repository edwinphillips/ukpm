(function ($) {

Drupal.Liberty = Drupal.Liberty || {};
Drupal.Liberty.currentWidth = -1;
Drupal.Liberty.currentType = -1;
Drupal.Liberty.screens = [0, 767.5, 991.5, 989.5];
Drupal.Liberty.mobileThreadHold = 991.5;
Drupal.Liberty.clearMinHeight = function(element) {
  $(element).css('min-height', '0px');
}

Drupal.Liberty.equalHeight = function() {
}



Drupal.Liberty.equalHeightActions = function() {
  Drupal.Liberty.equalHeight();
}

Drupal.Liberty.onClickResetDefaultSettings = function() {
  var answer = confirm(Drupal.t('Are you sure you want to reset your theme settings to default theme settings?'))
  if (answer){
    $("input:hidden[name = light_use_default_settings]").attr("value", 1);
    return true;
  }

  return false;
}

Drupal.Liberty.eventStopPropagation = function(event) {
  if (event.stopPropagation) {
    event.stopPropagation();
  }
  else if (window.event) {
    window.event.cancelBubble = true;
  }
}

Drupal.behaviors.actionLiberty = {
  attach: function (context) {
    $("ul.menu > li > a.fa").each(function() {
      var icon = $('<i class="' + $(this).attr('class') + '"/>');
      if($(this).hasClass('keep-content')) {
        $(this).prepend('icon');
      }
      else {
        $(this).html("").append(icon);
      }
      var className = $(this).attr('class');
      var parts = className.split(" ");
      var classes = [];
      for(x in parts) {
        if(parts[x].indexOf('fa') !== 0) {
          classes.push(parts[x]);
        }
      }
      $(this).attr('class', classes.join(' '));
    });
    $(".change-skin-button").click(function() {
      parts = this.href.split("/");
      style = parts[parts.length - 1];
      $.cookie("liberty_skin", style, {path: '/'});
      window.location.reload();
      return false;
    });
    jQuery(".change-background-button").on("click", function() {
      parts = this.href.split("/");
      style = parts[parts.length - 1];
      var current_background = jQuery.cookie("liberty_background");
      jQuery.cookie("liberty_background", style, {path: "/"});
      jQuery("body").removeClass(current_background);
      jQuery("body").addClass(style);
      return false;
    });
    $(window).scroll(function() {
      if($(window).scrollTop() > 200) {
        $('.btn-btt').show();
      }
      else {
        $('.btn-btt').hide();
      }
    });

    $('#change-skin').once('load').on('click', function(){
      $('#change-skin i').toggleClass('fa-spin');
      $('#change_skin_menu_wrapper').toggleClass('fly-out');
    });

    $(window).load(function() {
      Drupal.Liberty.equalHeightActions();
    });
    
    if($("#block-search-form .search-icon").length == 0) {
      $("#block-search-form > .content").prepend('<span class="search-icon"> </span>');
    }

    $("#block-search-form .search-icon").click(function() {
      if($(this).closest('#block-search-form').hasClass('hover')) {
        $(this).closest('#block-search-form').removeClass('hover');
      }
      else {
        $(this).closest('#block-search-form').addClass('hover');
      }
    });

    $("#block-search-form").click(function(e) {
      Drupal.Liberty.eventStopPropagation(e);
    });
    $('body').click(function() {
      if($('#block-search-form').hasClass('hover')) {
        $('#block-search-form').removeClass('hover');
      }
    });
    $(window).resize(function() {
      var width = $(window).innerWidth();
      if((width - Drupal.Liberty.mobileThreadHold) * (Drupal.Liberty.currentWidth - Drupal.Liberty.mobileThreadHold) < 0) {
        if(width > Drupal.Liberty.mobileThreadHold) {
          $("#main-menu-inner").css({width: ""});
        }
      }
      Drupal.Liberty.currentWidth = width;
    });

  }
};
})(jQuery);
