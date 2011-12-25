function getInternetExplorerVersion(){
  var rv = -1; // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer'){
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
}

function carrega_som(s){
	if(getInternetExplorerVersion() == -1 || getInternetExplorerVersion() >= 9){
		var nome = $(s).attr("name");
		$(s).jPlayer("clearMedia");
		$(s).jPlayer( {
			ready: function () {
		    	$(s).jPlayer("setMedia", {
					oga: "sounds/ogg/" + nome + ".ogg",
		    		mp3: "sounds/mp3/" + nome + ".mp3"
		    	});
		    },
		    supplied: "oga, mp3",
			swfPath: "flashs"
		});
	}
}

function sound(nome){
	// para o IE
		/*$(".sound[name='"+nome+"']").jPlayer("setMedia", {
			oga: "sounds/ogg/" + nome + ".ogg",
			mp3: "sounds/mp3/" + nome + ".mp3"
		}).jPlayer("play", 0);*/
	//
	$(".sound[name='"+nome+"']").jPlayer("play", 0);
	
}