/**
* Created by Shihab 2012
*
* Version: 1
* Requires: jQuery 1.4+
*
*/


/***
	Using Google Maps Api V3
	http://maps.google.com/maps/api/js?sensor=true
***/



;(function ($) {

	if (window.location.protocol == "https:") {
		document.write('<' + 'script src="https://maps.google.com/maps/api/js?sensor=true"' + ' type="text/javascript"><' + '/script>');
	} else {
		document.write('<' + 'script src="http://maps.google.com/maps/api/js?sensor=true"' + ' type="text/javascript"><' + '/script>');
	}

	/*
	 * Private methods
	 */
	_changeTravelMode = function(request, travelMode, directionsService, directionsDisplay, defaultOptions) {
		request.travelMode = travelMode;

		directionsService.route(request, function(response, status) {
			_directionsStatus(response, status, directionsDisplay, defaultOptions);
		});
	},

	_directionsStatus = function(response, status, directionsDisplay, defaultOptions) {
		switch(status) {
			case google.maps.DirectionsStatus.OK:
				if (defaultOptions.from_markerContent) {
					response.routes[0].legs[0].start_address = defaultOptions.from_markerContent;
				}
				if (defaultOptions.to_markerContent) {
					response.routes[0].legs[0].end_address = defaultOptions.to_markerContent;
				}
				directionsDisplay.setDirections(response);
				break;
			case google.maps.DirectionsStatus.NOT_FOUND:
				alert("One of the location specified could not be geocoded.");
				break;
			case google.maps.DirectionsStatus.ZERO_RESULTS:
				alert("No route found.");
				break;
			case google.maps.DirectionsStatus.MAX_WAYPOINTS_EXCEEDED:
				alert("Directions waypoints over limit.");
				break;
			case google.maps.DirectionsStatus.INVALID_REQUEST:
				alert("invalid direction request.");
				break;
			case google.maps.DirectionsStatus.OVER_QUERY_LIMIT:
				alert("Too many requests within the allowed period of time.");
				break;
			case google.maps.DirectionsStatus.REQUEST_DENIED:
				alert("Access denied to Google Maps directions service.");
				break;
			default:
				alert("Server error occured. Please try again.");
				break;
		}
	},

	_addMarker = function(map, markerData) {
		var marker = new google.maps.Marker({
			map: map,
			position: new google.maps.LatLng(markerData.lat, markerData.lng),
			title: markerData.title,
			icon: markerData.markerImage
		});

		var infoWindow = new google.maps.InfoWindow({
			content: markerData.markerContent
		});

		google.maps.event.addListener(marker, 'click', function () {
			infoWindow.open(map, this);
		});
	};


	/*
	 * public methods
	 */
	$.fn.extend({
		drawMap: function(options) {

			return this.each(function () {

				var defaultOptions, marker, infoWindow;

				defaultOptions = {
					"address": "Dhaka, Bangladesh",
					"markerContent": "",
					"mapType": "roadmap",
					"zoom": 14,
					"streetViewControl": true
				};

				if (options) {
					defaultOptions = $.extend(defaultOptions, options);
				}
				if (defaultOptions.markerContent == "") {
					defaultOptions.markerContent = defaultOptions.address;
				}

				defaultOptions.mapType = defaultOptions.mapType.toLowerCase();
				if (defaultOptions.mapType != "roadmap" && defaultOptions.mapType != "satellite" &&
					defaultOptions.mapType != "hybrid" && defaultOptions.mapType != "terrain") {
					defaultOptions.mapType = "roadmap";
				}

				var geocoder = new google.maps.Geocoder();
				var map = new google.maps.Map(this, {
					zoom: defaultOptions.zoom,
					mapTypeId: defaultOptions.mapType,
					streetViewControl: defaultOptions.streetViewControl
				});

				geocoder.geocode({ 'address': defaultOptions.address }, function (results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						map.setCenter(results[0].geometry.location);
						marker = new google.maps.Marker({
							map: map,
							position: results[0].geometry.location,
							icon: defaultOptions.markerImage
						});

						infoWindow = new google.maps.InfoWindow({
							position: map.getCenter(),
							content: defaultOptions.markerContent
						});

						google.maps.event.addListener(marker, 'click', function () {
							infoWindow.open(map, this);
						});
					} else {
						alert("Geocode was not successful for the following reason: " + status);
					}
				});
			});
		}, // drawMap

		loadMarkers: function(options) {

			return this.each(function () {
				var defaultOptions;

				defaultOptions = {
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
				};

				if (options) {
					defaultOptions = $.extend(defaultOptions, options);
				}

				var map = new google.maps.Map(this, {
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					streetViewControl: true
				});

				for (i in defaultOptions.markers) {
					_addMarker(map, defaultOptions.markers[i]);
				}

				var markerData, bounds = new google.maps.LatLngBounds();
				for (index in defaultOptions.markers) {
					markerData = defaultOptions.markers[index];
					bounds.extend(new google.maps.LatLng(markerData.lat, markerData.lng));
				}
				map.fitBounds(bounds);
			});
		}, // loadMarkers

		getDirections: function(options) {

			return this.each(function () {
				var defaultOptions, request, requestStatus, directionsDisplay, directionsService = new google.maps.DirectionsService();
				var elem = this;
				var timestamp = new Date().getTime();
				defaultOptions = {
					"from": "Zero point, Dhaka, Bangladesh",
					"to": "Shapla Chottor, Motijheel, Dhaka, Bangladesh",
					"directionsPane": "map_directions"
				};

				if (options) {
					defaultOptions = $.extend(defaultOptions, options);
				}

				var directionsPaneClass = defaultOptions.directionsPane;
				defaultOptions.directionsPane = defaultOptions.directionsPane + "_" + timestamp;

				$(elem).css("overflow", "hidden");
				var dpWidth = ($(elem).width() * 40) / 100;
				if (dpWidth < 240) {
					dpWidth = 240;
				} else if (dpWidth > 340) {
					dpWidth = 340;
				}

				$(elem).after("<div class='" + directionsPaneClass + " " + defaultOptions.directionsPane + "' style='opacity:0.85;filter:alpha(opacity=85);border:solid 1px #ccc;font-size:0.9em;background-color:#fff;position:absolute;right:0;top:27px;width:" + dpWidth + "px;height:" + ($(elem).height() - 55) + "px;padding:0 5px  5px;z-index:9999;overflow:auto;display:none;'></div>");

				directionsDisplay = new google.maps.DirectionsRenderer();
				var map = new google.maps.Map(elem, {
					zoom: 8,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					streetViewControl: true
				});

				var wayPoints = [];

				var totalLocations;
				if (defaultOptions.locations) {
					totalLocations = defaultOptions.locations.length;
					if (totalLocations > 1) {
						defaultOptions.from = defaultOptions.locations[0];
						defaultOptions.to = defaultOptions.locations[totalLocations - 1];
						if (totalLocations > 2) {
							for (var i = 1; i < (totalLocations - 1); i++) {
								wayPoints.push({
									location: defaultOptions.locations[i],
									stopover: true
								});
							}
						}
					}
				}

				directionsDisplay.setMap(map);
				directionsDisplay.setPanel($('.' + defaultOptions.directionsPane).get(0));

				if (wayPoints.length > 0) {
					request = {
						origin: defaultOptions.from,
						destination: defaultOptions.to,
						waypoints: wayPoints,
						travelMode: google.maps.DirectionsTravelMode.DRIVING
					};
				} else {
					request = {
						origin: defaultOptions.from,
						destination: defaultOptions.to,
						travelMode: google.maps.DirectionsTravelMode.DRIVING
					};
				}

				directionsService.route(request, function(response, status) {
					_directionsStatus(response, status, directionsDisplay, defaultOptions);

					if (status == google.maps.DirectionsStatus.OK) {
						$(elem).append(
							"<div class='travelMode_" + timestamp + "' style='direction: ltr; overflow: hidden; text-align: center; color: rgb(0, 0, 0); font-family: Arial,sans-serif; -moz-user-select: none; font-size: 13px; background: none repeat scroll 0% 0% rgb(255, 255, 255); border: 1px solid rgb(113, 123, 135); box-shadow: 0pt 2px 4px rgba(0, 0, 0, 0.4); width: 64px; position: absolute; top: 5px; right: 198px; cursor: pointer; z-index: 99999;'>" +
							"	<div class='spnTravelMode_" + timestamp + "' style='padding: 0 6px 1px; font-weight:bold;border-bottom:solid 1px #ddd;'>Driving</div>" +
							"	<div class='travelOptions_" + timestamp + "' style='display:none;'>" +
							"		<div id='DRIVING' class='travelOption_" + timestamp + "' style='padding: 2px 6px; text-align:left;margin:2px 0;'>Driving</div>" +
							"		<div id='BICYCLING' class='travelOption_" + timestamp + "' style='padding: 2px 6px; text-align:left;margin:2px 0;'>Cycling</div>" +
							"		<div id='WALKING' class='travelOption_" + timestamp + "' style='padding: 2px 6px; text-align:left;margin:2px 0;'>Walking</div>" +
							"	</div>" +
							"</div>" +
							"<div class='directionsPane_" + timestamp + "' style='direction:ltr;text-align:center;color:#000;font:normal 13px Arial,sans-serif;-moz-user-select:none;background-color:#fff; border:1px solid #717B87;box-shadow:0 2px 4px rgba(0, 0, 0, 0.4);position:absolute;top:5px;right:118px;cursor:pointer;z-index:99999;padding:1px 6px;width:63px;'>Directions</div>"
						);

						$('div.travelMode_' + timestamp).after($('.' + defaultOptions.directionsPane).get(0));

						$('.' + defaultOptions.directionsPane).css({
							"display": "block",
							"right": (0 - (dpWidth + 12))
						});

						$('div.directionsPane_' + timestamp).click(function() {
							var dp = $(this);
							if (dp.hasClass("active")) {
								dp.removeClass("active").css({
									"font-weight": "normal"
								});

								$('.' + defaultOptions.directionsPane).animate({
									"right": (0 - (dpWidth + 12))
								});
							} else {
								dp.addClass("active").css({
									"font-weight": "bold"
								});
								$('.' + defaultOptions.directionsPane).animate({
									"right": 0
								});
							}
						});

						$('div.travelMode_' + timestamp).mouseenter(function() {
							$('div.travelOptions_' + timestamp).show();
						}).mouseleave(function() {
							$('div.travelOptions_' + timestamp).hide();
						});
					}
				});

				$(document).delegate('div.travelOption_' + timestamp, "mouseenter", function() {
					$(this).css("font-weight", "bold");
				}).delegate('div.travelOption_' + timestamp, "mouseleave", function() {
					$(this).css("font-weight", "normal");
				}).delegate('div.travelOption_' + timestamp, "click", function() {
					$('.spnTravelMode_' + timestamp).text($(this).text());
					$('div.travelOptions_' + timestamp).hide();
					_changeTravelMode(request, $(this).attr("id"), directionsService, directionsDisplay, defaultOptions);
				});
			});
		} // getDirections
	});
})(jQuery);

;(function(j) {
	j(function() {
		var maps = j('[data-map]'), map, mapData;
		for (var i = 0; i < maps.length; i++) {
			map = j(maps[i]);
			mapData = map.data();

			if (mapData.map == "location") {
				map.drawMap(mapData);
			} else if (mapData.map == "pointers") {
				map.loadMarkers(mapData);
			} else if (mapData.map == "direction") {
				map.getDirections(mapData);
			}
		}
	});
})(jQuery);