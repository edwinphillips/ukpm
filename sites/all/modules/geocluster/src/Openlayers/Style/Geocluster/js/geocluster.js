Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.style.internal.geocluster',
  init: function(data) {
    // Init styles cache.
    if (typeof (Drupal.openlayers.instances[data.map_id].geoclusterStyles) == 'undefined') {
      Drupal.openlayers.instances[data.map_id].geoclusterStyles = {};
    }
    if (typeof (Drupal.openlayers.instances[data.map_id].geoclusterStyles[data.data.mn]) == 'undefined') {
      Drupal.openlayers.instances[data.map_id].geoclusterStyles[data.data.mn] = {};
    }
    // Set the style for the 1 item marker.
    if (typeof (Drupal.openlayers.instances[data.map_id].geoclusterStyles[data.data.mn][1]) == 'undefined') {
      for (var i in Drupal.settings.openlayers.maps[data.map_id].style) {
        var style = Drupal.settings.openlayers.maps[data.map_id].style[i];
        if (style.mn == data.opt.style) {
          Drupal.openlayers.instances[data.map_id].geoclusterStyles[data.data.mn][1] = [Drupal.openlayers.getObject(data.context, 'styles', style, data.map_id)];
          break;
        }
      }
    }

    // The function styles cluster according number of items. If there's just
    // one item the standard marker is used.
    return function(feature, resolution) {
      var size = feature.get('geocluster_count');
      // Try to fetch the style from the cache.
      var style = Drupal.openlayers.instances[data.map_id].geoclusterStyles[data.data.mn][size];
      if (!style) {
        style = new ol.style.Style({
          image: new ol.style.Circle({
            radius: 10,
            stroke: new ol.style.Stroke({
              color: '#fff'
            }),
            fill: new ol.style.Fill({
              color: '#3399CC'
            })
          }),

          text: new ol.style.Text({
            text: size.toString(),
            fill: new ol.style.Fill({
              color: '#fff'
            })
          })
        });
        // Allow others to change the default style.
        jQuery(document).trigger('openlayers.geocluster.style_alter', [{
          style: style,
          map_id: data.map_id,
          size: size,
          feature: feature,
          resolution: resolution
        }]);
        Drupal.openlayers.instances[data.map_id].geoclusterStyles[data.data.mn][size] = [style];
      }
      return style;
    }
  }
});
