<?php

/**
 * @file
 * Geohash-specifics for geocluster.
 */

/**
 * Diameter of the Earth in kilometers.
 */
define('GEOCLUSTER_GEOHASH_LENGTH', 12);

/**
 * Add geohash columns required by geocluster to geofield schemata.
 *
 * Implements hook_field_schema_alter().
 * @todo: this hook requires a core patch, see http://drupal.org/node/691932
 */
function geocluster_field_schema_alter(&$schema, $field) {
  if ($field['type'] == 'geofield') {

    // Adds separate columns for the geohash indices, from length 1 to max.
    for ($i = 1; $i <= GEOCLUSTER_GEOHASH_LENGTH; $i++) {
      $name = 'geocluster_index_' . $i;
      $schema['columns'][$name] = array(
        'description' => 'Geocluster index level ' . $i,
        'type' => 'varchar',
        'length' => GEOCLUSTER_GEOHASH_LENGTH,
        'not null' => FALSE,
      );
      // $schema['indexes']['fid_' . $name] = array('fid', $name);
    }
  }
}
/**
 * Implements hook_entity_presave().
 *
 * Adds the geohash column data to geofield locations.
 *
 * @param (object) $entity
 *   The entity object which is about to be saved
 * @param $entity_type
 *   The type of the entity that is about to be saved.
 */
function geocluster_entity_presave($entity, $entity_type) {

  // Get some useful info about the entity.
  $field_info_by_id = field_info_field_by_ids();
  list($id, $vid, $bundle) = entity_extract_ids($entity_type, $entity);
  $field_info_instances = field_info_instances($entity_type, $bundle);

  // If this is a geofield, we need to add the geohash column data.
  foreach ($field_info_instances as $field_name => $field_info) {
    if ($field_info_by_id[$field_info['field_id']]['type'] == 'geofield') {
      if (!empty($entity->{$field_name}[LANGUAGE_NONE])) {
        foreach ($entity->{$field_name}[LANGUAGE_NONE] as $delta => $field) {
          // Add data for geohash prefix columns.
          for ($i = GEOCLUSTER_GEOHASH_LENGTH; $i > 0; $i--) {
            $geohash_key = 'geocluster_index_' . $i;
            $location = field_get_items($entity_type, $entity, $field_name);
            $geohash_prefix = _geocluster_get_geohash_prefix($location[0]['geohash'], $i);
            $entity->{$field_name}[LANGUAGE_NONE][$delta][$geohash_key] = $geohash_prefix;
          }
        }
      }
    }
  }
}

/**
 * Add geohash property for all geofields.
 *
 * Implements hook_entity_property_info_alter().
 */
function geocluster_entity_property_info_alter(&$info) {
  foreach ($info as &$entity_type) {
    _geocluster_add_geohash_property($entity_type);
    if (isset($entity_type['bundles'])) {
      foreach ($entity_type['bundles'] as &$bundle) {
        _geocluster_add_geohash_property($bundle);
      }
    }
  }
}

/**
 * Helper function that adds geohash properties for a geofield.
 */
function _geocluster_add_geohash_property(&$value) {
  if (isset($value['properties'])) {
    foreach ($value['properties'] as &$property) {
      if (isset($property['type']) && $property['type'] == 'geofield') {
        $property['property info']['geohash'] = array(
          'label' => t('Geohash'),
          'type' => 'string',
          'description' => t('Returns the location as geohash'),
          'getter callback' => 'geocluster_geohash_property_get_callback',
          'computed' => TRUE,
        );

        for ($i = GEOCLUSTER_GEOHASH_LENGTH; $i > 0; $i--) {
          $property['property info']['geocluster_index_' . $i] = array(
            'label' => t('Geocluster index level ' . $i),
            'type' => 'string',
            'description' => t('Returns the location as geohash with length ' . $i),
            'getter callback' => 'geocluster_index_property_get_callback',
            'geohash length' => $i,
            'computed' => TRUE,
          );
        }
      }
    }
  }
}

/**
 * Getter callback for a geofield geohash property.
 */
function geocluster_geohash_property_get_callback($entity, array $options, $name, $type, $info) {
  return $entity['geohash'];
}

/**
 * Returns geohash prefixes for a given geohash-enabled entity field.
 *
 * If $info['geohash length'] is specified, the particular geohash prefix will
 * be returned. Otherwise, an array of geohash prefixes starting with length 1
 * up to the total length of the original geohash will be returned.
 *
 * example:
 *   u
 *   u2
 *   u2s
 *   ...
 *
 * see http://stackoverflow.com/questions/11319465/geoclusters-in-solr/11321723#11321723
 *
 */
function geocluster_index_property_get_callback($entity, array $options, $name, $type, $info) {
  $geohash = geocluster_geohash_property_get_callback($entity, $options, $name, $type, $info);
  // Output an specifc geohash prefix by the specified length.
  if (isset($info['geohash length'])) {
    $length = min($info['geohash length'], strlen($geohash));
    return  _geocluster_get_geohash_prefix($geohash, $length);
  }
  // No length specified.
  // Output an array of all geohash prefixed numbered by their length.
  $geohash_index = array();
  for ($i = strlen($geohash); $i > 0; $i--) {
    $geohash_index[] = _geocluster_get_geohash_prefix($geohash, $i);
  }
  return $geohash_index;
}

/*** INTERNAL HELPERS ***/

/**
 * Get a geohash prefix of a specified, maximum length.
 *
 * @param $geohash
 * @param $length
 * @return string
 */
function _geocluster_get_geohash_prefix($geohash, $length) {
  return substr($geohash, 0, min($length, strlen($geohash)));
}
