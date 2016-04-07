'use strict';

/* jshint bitwise: false */
/* globals L */

function BuoyMapController($scope, $location, $timeout,
    NpolarEsriLeaflet,
    Buoy) {

  'ngInject';

  function initMap() {
    let esriBase = `${NpolarEsriLeaflet.base}/inspire1/NP_TopoArktis_UPSN_CLX/MapServer`;
    let map = NpolarEsriLeaflet.mapFactory(esriBase);
    map.setView([70, 0], 2);

    let attribution = `Map: <a href="http://npolar.no">Norsk Polarinstitutt</a> &mdash; Data: `;
    attribution += `G Spreen, P Itkin (2015) <a href="https://data.npolar.no/dataset/6ed9a8ca-95b0-43be-bedf-8176bf56da80">N-ICE2015 buoy data</a>`;
    attribution += ` (<a rel="license" href="http://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>)`;
    map.attributionControl.addAttribution(attribution);


    $scope.layerControl = L.control.layers(null, null, { collapsed: true }).addTo(map);
    $scope.layerGroup = L.layerGroup();
    $scope.map = map;
  }

  function buoys() {
    return Buoy.facets({q:'', facets: 'title', 'size-facet': 1000}).$promise.then(r => {
      return r.find(f => f.facet === 'title').terms;
    });
  }

  // FIXME: Data lack cruise code (N-ICE2015 so need to add this or filter by the deployment dates...)
  function dailyPositions(buoy, interval='12h') {
    $scope.interval = interval;

    return Buoy.feed({q: '',
      'filter-title': buoy,
      //'filter-latitude': '70..',
      [`date-${interval}`]: 'measured[latitude:longitude]',
      sort: '-measured',
      format: 'raw', limit: 1}).$promise.then(r => {

        let d = r.hits.hits[0]._source;

        return r.aggregations[`${interval}-measured`].buckets.map(es => {
          return { type: 'Point', coordinates: [parseFloat(es.longitude.avg.toFixed(4)), parseFloat(es.latitude.avg.toFixed(4))],
            properties: { date: es.key_as_string, buoy, type: d.type, owner: d.owner, deployed: d.deployment.date}
          };

        });
    });
  }

  function pointFeature(point) {
    return { type: 'Feature', properties: point.properties,
      geometry: { coordinates: point.coordinates, type: 'Point' }
    };
  }

  function lineStringFeature(points, propertyFunction=(points => points[0].properties)) {

    let properties = propertyFunction(points);

    return { type: 'Feature', properties,
      geometry: {
        coordinates: points.map(point => point.coordinates),
        type: 'LineString'
      }
    };
  }

  // fillColor="#"+((1<<24)*Math.random()|0).toString(16);
  function hexColor(str, gamma=1, hash=5381) {
    let c, r, g, b;

    for(c = 0; c < str.length; ++c) {
      hash = ((hash << 5) + hash) + str.charCodeAt(c);
    }

    gamma = 1 - gamma;
    hash = ((hash * 0x6B43A95B) % 0xFFFFFF) >>> 0;
    r = (r = (((hash >> 16) & 0xFF))) + ((255 - r) * gamma) >>> 0;
    g = (g = (((hash >>  8) & 0xFF))) + ((255 - g) * gamma) >>> 0;
    b = (b = (((hash >>  0) & 0xFF))) + ((255 - b) * gamma) >>> 0;

    return "#" + ("000000" + ((r << 16) + (g << 8) + b).toString(16)).slice(-6);
  }


  function pointToLayer(feature, latlng) {

    let fillColor = hexColor(feature.properties.buoy);

    return L.circleMarker(latlng, { radius: 4,
      fillColor,
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });
  }

  function onEachFeature(feature, layer) {
    let properties;
    if (feature.geometry.type === 'Point') {
      properties = feature; // This includes coordinates for points...
    } else {
      properties = feature.properties;
      properties.days = feature.geometry.coordinates.length; // Assuming interval is 24h!
    }
    layer.bindPopup("<dl>"+JSON.stringify(properties)+"</dl>", { minWidth: "100%" });
	}

  // Wrap Leaflet map in a $timeout
  $timeout(() => {
    initMap();

    let geometry = $location.search().geometry || "LineString";
    //let overlays = [];
    let c = 0;

    buoys().then(buoys => {

      buoys.forEach(buoy => {

        c += 1;

        let color = hexColor(buoy.term);
        let style = {
            "color": color,
            "weight": 5,
            "opacity": 0.65,
            "radius": 10
        };

        dailyPositions(buoy.term, '24h').then(points => {

          let features, featureCollection;
          if (geometry === 'Point') {
            features = points.map(point => pointFeature(point));
            featureCollection = L.geoJson({ type: 'FeatureCollection', features }, { pointToLayer, onEachFeature });
          } else {
            features = [lineStringFeature(points, (points) => points[0].properties)];
            featureCollection = L.geoJson(features, { pointToLayer, onEachFeature, style });
          }
          let owner = features[0].properties.owner;

          $scope.layerControl.addOverlay(featureCollection, `<span class="colorblock" style="background: ${color};"></span>${buoy.term} — ${owner}`);
          if ((/SVP/).test(buoy.term)) {
            featureCollection.addTo($scope.map);
          }

          console.log(c);

        });

      });
    });

  }); // end $timeout

}


module.exports = BuoyMapController;
