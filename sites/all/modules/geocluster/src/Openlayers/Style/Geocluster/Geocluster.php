<?php
/**
 * @file
 * Style: Geocluster.
 */

namespace Drupal\openlayers\Style;
use Drupal\openlayers\Types\Style;

$plugin = array(
  'class' => '\\Drupal\\openlayers\\Style\\Geocluster',
);

/**
 * Class Geocluster.
 */
class Geocluster extends Style {

  /**
   * {@inheritdoc}
   */
  public function optionsForm(&$form, &$form_state) {
    $styles = ctools_export_crud_load_all('openlayers_styles');
    $options = array('' => t('<Choose the style>'));
    foreach ($styles as $machine_name => $data) {
      $options[$machine_name] = $data->name;
    }

    $form['options']['style'] = array(
      '#type' => 'select',
      '#title' => t('Style'),
      '#default_value' => isset($form_state['item']->options['style']) ? $form_state['item']->options['style'] : '',
      '#description' => t('Select the style for features with just one item.'),
      '#options' => $options,
      '#required' => TRUE,
    );
  }

  /**
   * {@inheritdoc}
   */
  public function buildCollection() {
    parent::buildCollection();

    // Add the standard style for 1 item clusters.
    if ($data = $this->getOption('style', FALSE)) {
      if ($object = openlayers_object_load('style', $data)) {
        $this->getCollection()->merge($object->getCollection());
      }
    }

    return $this->getCollection();
  }
}
