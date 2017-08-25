const map = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer(
  'https://cartocdn-ashbu.global.ssl.fastly.net/ramirocartodb/api/v1/map/named/tpl_756aec63_3adb_48b6_9d14_331c6cbc47cf/all/{z}/{x}/{y}.png', {
    maxZoom: 18,
  }).addTo(map);

let [lat, lon] = [3.95, 19.08]
map.setView([lat, lon], 10);

async function getLocations (type) {
  let response = await axios.get(`/api/locations?type=${type}`)
  let locations = response.data
  console.log(locations)
  L.geoJSON(locations, {
    onEachFeature: onEachLocation
  }).addTo(map);
}

function onEachLocation (feature, layer) {
  if (feature.properties) {
    layer.bindPopup(feature.properties.name);
  }
}


function onEachBoundary (feature, layer) {
  if (feature.properties) {
    layer.bindPopup(feature.properties.name);
  }
}
async function getPoliticalBoundaries () {
  let response = await axios.get('/api/politicalClaims')
  let boundaries = response.data
  console.log(boundaries)
  L.geoJSON(boundaries, {
    onEachFeature: onEachBoundary
  }).addTo(map);
}

getPoliticalBoundaries()

getLocations('Castle')

async function searchWiki(term) {
  let response = await axios.get('/api/details',{
    params: {
      term
    }
  })
  console.log(response.data)
}

searchWiki('winterfell')

/**
 * Filters
 *
 * cities
 * castles
 * town
 * ruin
 * location
 * roads
 * rivers
 * lakes
 * continents
 * islands
 */

 /**
  * Sidebar content

  http://gameofthrones.wikia.com/api/v1/Search/List/?query=winterfell&limit=25&namespaces=0%2C14

  http://gameofthrones.wikia.com/api/v1/Articles/Details/?ids=2039&abstract=500&width=200&height=200

  http://gameofthrones.wikia.com/api/v1/Articles/AsSimpleJson/?id=2039

  */