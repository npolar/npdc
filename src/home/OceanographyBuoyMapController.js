'use strict';
// jshint bitwise: false
// globals L

function BuoyMapController($scope, $location, $timeout,
    NpolarEsriLeaflet, NpolarMessage, NpolarTranslate,
    Buoy) {

  'ngInject';
  
  let dataset = {
    id: '6ed9a8ca-95b0-43be-bedf-8176bf56da80',
    license: 'http://creativecommons.org/licenses/by/4.0/',
    licenseText: 'CC BY 4.0', // @todo NpolarLicense.name(uri, { type: 'short', 'language': Npolar.Lang.getLang()})
    people: [{ name: 'G Spreen', roles: ['author']}, { name: 'P Itkin', roles: ['author']}],
    title: 'N-ICE2015 buoy data',
    released: '2015',
  };
  dataset.uri = `https://data.npolar.no/dataset/${dataset.id}`;
  dataset.roles = (role) => dataset.people.filter(p => p.roles.includes(role));
  dataset.attribution = () => {
    if ((/^http\:\/\/creativecommons\.org\/licenses/).test(dataset.license)) {
      let names = dataset.roles('author').map(a => a.name).join(', ');
      return `${names} (${dataset.released}). <a href="${dataset.uri}">${dataset.title}</a>`;
    } else {
      return dataset.license;
    }
    
  }  
  
  $scope.dataset = dataset;
  
  $scope.changeBuoyType = function(e) {
    $scope.layerGroup.eachLayer(layer => {
      console.log('layer', layer);
      //$scope.map.removeLayer(layer);
    });
  
  };
  
  function initMap() {
    let esriBase = `${NpolarEsriLeaflet.base}/inspire1/NP_TopoArktis_UPSN_CLX/MapServer`;
    NpolarEsriLeaflet.element = 'map';
    let map = NpolarEsriLeaflet.mapFactory(esriBase);
    map.setView([70, 0], 2);
    
    // <!-- ${NpolarTranslate.translate('Map')}: <a href="http://npolar.no">${NpolarTranslate.translate('npolar.no')}</a> — --> 
    let attribution = `Data: ${dataset.attribution()} — <a href="https://github.com/npolar/npdc-home">Code</a>`;
    map.attributionControl.addAttribution(attribution);
    
    $scope.layerControl = L.control.layers(null, null, { collapsed: false }).addTo(map);
    $scope.layerGroup = L.layerGroup();
    $scope.map = map;
  }

  function buoys() {
    return Buoy.facets({q:'', facets: 'title', 'size-facet': 1000}).$promise.then(r => {
      return r.find(f => f.facet === 'title').terms;
    });
  }

  // FIXME: Data lack cruise code (N-ICE2015 so need to add this or filter by the deployment dates...)
  function dailyPositions(buoy, interval='24h') {
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
            properties: { date: es.key_as_string, buoy, type: d.type, owner: NpolarTranslate.translate(d.owner), deployed: d.deployment.date}
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
  
  try {
  
    // Wrap Leaflet map in a $timeout
    $timeout(() => {
      initMap();
      
      let geometry = $location.search().geometry || 'LineString';
      let interval = $location.search().interval || '24h';
      let buoysRegex = $location.search().type || /^SVP/ ;
      $scope.types = ['AFAR', 'SVP', 'SNOW', 'CALIB', 'SIMBA'].sort();
      
      Buoy.array({limit:1, sort: '-measured', fields: 'measured'}).$promise.then(r => {
        $scope.last = r[0].measured;
      });
      
      Buoy.facetTerms('title').then(buoys => {
        
        buoys.forEach(buoy => {
                    
          let color = hexColor(buoy.term);
          let style = {
              "color": color,
              "weight": 5,
              "opacity": 0.65,
              "radius": 10
          };
          
          dailyPositions(buoy.term, interval).then(points => {
            
            let features, featureCollection;
            if (geometry === 'Point') {
              features = points.map(point => pointFeature(point));
              featureCollection = L.geoJson({ type: 'FeatureCollection', features }, { pointToLayer, onEachFeature });
            } else {
              features = [lineStringFeature(points, (points) => points[0].properties)];
              featureCollection = L.geoJson(features, { pointToLayer, onEachFeature, style });
            }
            let owner = features[0].properties.owner;
            
            if (new RegExp(buoysRegex, 'i').test(buoy.term)) {
              $scope.layerControl.addOverlay(featureCollection, `<span class="colorblock" style="background: ${color};"></span>${buoy.term} — ${owner}`);
              featureCollection.addTo($scope.map);
              //  $scope.map.fitBounds(featureCollection.getBounds(), { maxZoom: 2});
              
            }
          });
          
          
        });
      } );
      
    }); // end $timeout
  
  } catch (e) {
    NpolarMessage.error(e);
  }
}


module.exports = BuoyMapController;
