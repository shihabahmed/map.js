#map.js
Draw google map easily.

##Dependency
1. jQuery 1.4+

##Methods
**drawMap**: Show an address at the specified location.

**loadMarkers**: Show a list of markers in the map.

**getDirections**: Show direction from one address to another.


##Usage

####Using jQuery
	$('.map-container').drawMap({
		address: "California, USA",
		markerContent: "California",
		mapType: "roadmap",
		zoom: 14
	});

	$('.map-container').loadMarkers({
		markers: [{
			lat: "35.4949825",
			lng: "-116.1445962",
			title: "Los Angeles",
			markerContent:"Los Angeles, CA"
		},
		{
			lat: "25.790534",
			lng: "-80.206600",
			title: "Miami",
			markerContent:"Miami, FL"
		}]
	});

	$('.map-container').getDirections({
		"from": "Sayedabad, Dhaka, Bangladesh",
		"to": "Kolatoli Rd, Cox's Bazar, Bangladesh",
		"directionsPane": "map_directions"
	});

####Using <code>data-</code> attribute
	<div class="map-container" data-map="location" data-address="Dhaka, Bangladesh" data-markerContent="Dhaka" data-mapType="roadmap" data-zoom="14" data-streetViewControl="true"></div>

	<div class="map-container" data-map="pointers" data-markers='[{"lat":"35.4949825","lng":"-116.1445962","title":"Los Angeles","markerContent":"Los Angeles, CA"},{"lat":"25.790534","lng":"-80.206600","title":"Miami","markerContent":"Miami, FL"},{"lat":"40.721724","lng":"-73.997780","title":"NewYork","markerContent":"New York, NY"}]'></div>

	<div class="map-container" data-map="direction" data-to="15 New Baily Road, Dhaka, Bangladesh" data-from="Matuail, Jatrabari, Dhaka, Bangladesh" data-directionsPane="map_directions"></div>
