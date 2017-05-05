// OUR MAP
var map;

// Coordinates of my HOME TOWN
var myPlace = {lat: 19.0760, lng: 72.8777 };

//Pop up windows on marker
var infowindow;

// Intialize markers as NULL 
var markers = [];

var locations = [];

var metadata;
	
function mapError() {
	console.log( "Erro come here");
	appViewModel.error( true );
	appViewModel.errorMessage("Could't load the map");
}
function fetchRestaurant() {
	$.ajax({
		url:'https://api.foursquare.com/v2/venues/search?v=20161016&ll=19.0760%20%2C%2072.8777&query=restaurant&intent=checkin&client_id=3RL5552F0F4CTDGNDKA5CFBQDTT2GOOVEYJHDK4VEYOD0GXW&client_secret=UBS24IQJ3PSGDPYSIYJ0JTPSBN4EFEV0EHI4PSEQJUOFYXCA',
		async: true
	}).done( function( response ) {
		metadata = response.response.venues;
		//console.log( metadata );
 		for( var i = 0 ; i < metadata.length; i++ ) {
 			//console.log( metadata[ i ]  );
 			var lat = metadata[ i ].location.lat;
 			var lng = metadata[ i ].location.lng;
 			var l = {
 				title : metadata[ i ].name,
 				position : { lat , lng }
 			};
 			locations.push( l );
 			var marker = new google.maps.Marker({
 				position: { lat , lng },
                map: map,
 				title: metadata[  i  ].name,
 				phoneno :metadata[i].contact.phone,
 				address : metadata[i].location.address,
 				animation : google.maps.Animation.DROP
 			});

 			markers.push( marker );
 			marker.addListener('click' , function() {
 				addInfoWindow( this , infowindow );
 			});
 		}
 		appViewModel.init();
 		//console.log( markers.length );
	}).fail( function( response , status, error){
		appViewModel.error( true );
		appViewModel.errorMessage('Could load the restaurant');
	});
}

function openInfoWindow( marker ) {
	var find_marker;
	for( var i = 0 ; i < markers.length ; i++ )
	{
		if( markers[ i ].position.lat().toFixed( 5 ) == marker.position.lat.toFixed( 5 )  && markers[ i ].position.lng().toFixed( 5 ) == marker.position.lng.toFixed( 5 ) )
		{	
			find_marker = markers[ i ];
		}
		//markers[ i ].setMap( null );
	}
	//find_marker.setMap( map );
	addInfoWindow( find_marker , infowindow );
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
	marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
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
	appViewModel.searchQuery('');
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
var appViewModel = {
	list: ko.observableArray([]),
	searchQuery: ko.observable(''),
	error: ko.observable( false ),
	errorMessage : ko.observable(''),
	init: function(query){
		for (var i in locations){
			appViewModel.list.push(locations[i]);
		}
	},
	searchingQuery: function(query){
		appViewModel.list.removeAll();
		//console.log( query );
		for( var i = 0 ; i < locations.length ; i++ )
		{
			if( locations[ i ].title.toLowerCase().indexOf( query.toLowerCase()) >=0 )
			{
                markers[ i ].setMap( map );
				appViewModel.list.push( locations[ i ] );
			}
            else
            {
                markers[ i ].setMap( null );
            }    
		}	
	},
}

ko.applyBindings( appViewModel );
appViewModel.searchQuery.subscribe(appViewModel.searchingQuery);
 		



