module.exports = function MapLocation(){
    var zoom = 6;
    var center = new google.maps.LatLng(55.3617609, -3.4433238);
    var geolocation = false;
    var map;
    var blockstate = false;
    var _self = this;
    this.init = function initFn(gmap, opts){
        zoom = opts.zoom || zoom;
        center = opts.center || center;
        geolocation = opts.geolocation || geolocation;
        map = gmap;
        this.getBookmark();
        this.setStartpoint();
        google.maps.event.addListener(
            map, 'idle', _self.onIdle
        );
    };
    this.getBookmark = function getBookmarkFn(){
        var url_location = window.location.hash.substr(1).split('/');
        if(url_location.length>3){
            zoom = parseInt(url_location[3]);
            center = new google.maps.LatLng(url_location[1], url_location[2]);
        }
    };
    this.setStartpoint = function setStartpointFn(){
        if(navigator.geolocation&&1===2) {
            navigator.geolocation.getCurrentPosition(function(position) {
                initialLocation = new google.maps.LatLng(
                    position.coords.latitude, position.coords.longitude
                );
                zoom = 12;
                center = initialLocation;
            });
        }
        this.setZoomAndCenter();
    };
    this.setZoomAndCenter = function setZoomAndCenterfn(){
        map.setZoom(zoom);
        map.setCenter(center);
    };
    this.onIdle = function onIdleFn(){
        if(!blockstate){
            var center = map.getCenter();
            var bookmark_bits = [
                center.lat(),
                center.lng(),
                map.getZoom()
            ];
            var bookmark_url = window.location.pathname + '#/' + bookmark_bits.join('/');
            history.pushState({}, 'Map Bookmark', bookmark_url);
        }
        blockstate = false;
    };
    $(window).on('popstate', function(state){
        blockstate = true;
        _self.getBookmark();
        _self.setZoomAndCenter();
    });
};
