// OUR MAP
var map;

// Coordinates of my HOME TOWN
var myPlace = {lat: 19.0760, lng: 72.8777 };

//Pop up windows on marker
var infowindow;

// Intialize markers as NULL 
var markers = [];

var metadata;
	

function fetchRestaurant() {
	$.ajax({
		url:'https://api.foursquare.com/v2/venues/search?v=20161016&ll=19.0760%20%2C%2072.8777&query=restaurant&intent=checkin&client_id=3RL5552F0F4CTDGNDKA5CFBQDTT2GOOVEYJHDK4VEYOD0GXW&client_secret=UBS24IQJ3PSGDPYSIYJ0JTPSBN4EFEV0EHI4PSEQJUOFYXCA',
		async: true
	}).done( function( response ) {
		metadata = response.response.venues;
		//console.log( metadata );
 		for( var i = 0 ; i < metadata.length && i < 10	 ; i++ ) {
 			//console.log( metadata[ i ]  );
 			var lat = metadata[ i ].location.lat;
 			var lng = metadata[ i ].location.lng;
 			var marker = new google.maps.Marker({
 				position: { lat , lng },
 				title: metadata[  i  ].name,
 				animation : google.maps.Animation.DROP,
 				id: i ,
 				phoneno :metadata[i].contact.phone,
 				address : metadata[i].location.address
 			});
 			markers.push( marker );
 			marker.addListener('click' , function() {
 				addInfoWindow( this , infowindow );
 			});
 		}
	});
}

function addInfoWindow( marker , infowindow ) {
		animateCurrentMarker( marker );
		if( infowindow.marker !== marker )
		{
			//console.log( 'hwllo' );
			stopCurrentMarker( infowindow , infowindow.marker );
		}
		infowindow.marker = marker;		
		content = '<div> <table style = "width:100%"> <tr><th>Name:</th><td>'+marker.title+'</td></tr>' ;
		content += '<tr><th> PhoneNo:</th><td>'+ ( marker.phoneno == undefined ? 'N/A' : marker.phoneno ) +'</td></tr>';
		content += '<tr><th> Address:</th><td>'+ ( marker.address == undefined ? 'N/A' : marker.address ) +'</td></tr>';
		content += '</table></div>'; 
		infowindow.setContent(content );
		infowindow.open( map , marker );
		infowindow.addListener('closeclick' , function () {
			stopCurrentMarker( infowindow , marker );
		});
}	

function animateCurrentMarker( marker ){
	marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
	marker.setAnimation(google.maps.Animation.BOUNCE);
}

function stopCurrentMarker( infowindow , marker ){
	if( marker !== undefined )
	{
		marker.setIcon(null);
		marker.setAnimation( null );
	}
}


function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
    center: myPlace,
    zoom: 12,
	});
	infowindow = new google.maps.InfoWindow();	
	fetchRestaurant();
}

function showMarkers() {
	var boundsLimit = new google.maps.LatLngBounds();

	for( var i = 0 ; i < markers.length ; i++ )
	{
		markers[ i ].setMap( map );
		boundsLimit.extend( markers[ i ].position );
	}
	map.fitBounds( boundsLimit );	
}

function hideMarkers() {
//	console.log( markers );
	for( var i = 0 ; i < markers.length ; i++ )
	{		
		markers[ i ].setMap( null );
	}	
}
var viewModel =  function(){
	var self = this;
	self.reslist = ko.observableArray( [1,2,3] );
}
ko.applyBindings( new viewModel() );





