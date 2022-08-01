/*
 * Basic responsive mashup template
 * @owner Enter you name here (xxx)
 */
/*
 *    Fill in host and port for Qlik engine
 */
var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );
var config = {
	host: 'qcs.us.qlikcloud.com',
	prefix: '/',
	port: 443,
	isSecure: window.location.protocol === "https:",
	webIntegrationId: '8LKld1ZiPfikaFXyxoPeFVxjumTTWp-3'
};
//Redirect to login if user is not logged in
async function login() {
      function isLoggedIn() {
        return fetch("https://"+config.host+"/api/v1/users/me", {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'qlik-web-integration-id': config.webIntegrationId,
          },
        }).then(response => {
          return response.status === 200;
        });
      }
      return isLoggedIn().then(loggedIn => {
        if (!loggedIn) {	  
            window.location.href = "https://"+config.host+"/login?qlik-web-integration-id=" + config.webIntegrationId + "&returnto=" + location.href;
            throw new Error('not logged in');
        }
      });
    }
login().then(() => {
    require.config( {
    baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources",
    webIntegrationId: config.webIntegrationId
} );			

require( ["js/qlik"], function ( qlik ) {
	qlik.on( "error", function ( error ) {
		$( '#popupText' ).append( error.message + "<br>" );
		$( '#popup' ).fadeIn( 1000 );
	} );
	$( "#closePopup" ).click( function () {
		$( '#popup' ).hide();
	} );
    //open apps -- inserted here --
	var app = qlik.openApp( '7a189951-db2d-42b6-9f7a-c16c678b6ae2', config );
	
    //get objects -- inserted here --
	app.visualization.get('312cdd87-afc4-454f-a837-6a88f7136624').then(function(vis){
    vis.show("QV01");	
	} );
    
} );});
