//funciones y ayudas del de paseo sonoro

// con esta estructura de datos, manejaremos el control de posiciones
function item(titulo, descripcion, latitud, longitud, radio, fichero)
{
    this.titulo=titulo;
    this.descripcion=descripcion;
    this.latitud=latitud;
    this.longitud=longitud;
    this.radio=radio;
    this.fichero=fichero;
    this.audio=document.createElement("AUDIO");
    this.audio.setAttribute("src","."+fichero);
    this.bola=null;
}

function paseo(titulo, descripcion, latitud, longitud, listaItems, latitud, longitud)
{
    this.titulo=titulo;
    this.descripcion=descripcion;
    this.latitud=latitud; //centro del paseo
    this.longitud=longitud; //centro del paseo
    this.listaItems=listaItems;
    this.audios_cargados=0; 
                            // PROBLEMA: no operativo, en móviles no sirve de nada cargar los audio porque
                            // el objeto de audio solicita los archivos cada vez al servidor 
    this.itemActivo=-1; 
    this.bolaPosicionActual=null;
    this.cLatitud=latitud;// punto central del paseo
    this.cLongitud=longitud; //punto central del paseo
}

function construyePaseo(xml) 
{
    console.log("construyePaseo");
    //Esta función de volcado incorpora la semantica del GeoRSS.
    // por el momento voy a volcar los siguientes elementos
    // <channel> 
    // ---<title>
    // ---<description>
    // ---<georss:point> latitud, longitud de centrado
    // ---<item>
    // ------<title>  
    // ------<description>
    // ------<georss:circle> latitud, longitud, radio
    // ------<notours:soundpoint>
    // -----------<notours:soundsource>
    // -----------------<notours:file>
    var xmlDoc = xml.responseXML;
    var titulo;
    var descripcion;
    var lat_long;
    var latitud;
    var longitud; 
    var x = xmlDoc.getElementsByTagName("channel");
    for (i = 0; i <x.length; i++) {  
      titulo=x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
      descripcion=x[i].getElementsByTagName("description")[0].childNodes[0].nodeValue; 
      lat_long=x[i].getElementsByTagName("point")[0].childNodes[0].nodeValue;
      var arr = lat_long.split(" ");
      latitud=arr[0]/1; // con esto fuerzo la conversion numerica
      longitud=arr[1]/1; // con esto fuerzo la conversion numerica
      console.log("\nlatitud:"+latitud+"longitud:"+longitud);                          
    }//for  -- en realidad solo deberíamos tener un channel

    var itemTitulo;
    var itemDescripcion;
    var itemLatitud;
    var itemLongitud;
    var itemRadio;
    var intemFichero;
    var lat_long_radio;
    //ahora voy a recorrer los items   
    x=xmlDoc.getElementsByTagName("item");
    console.log("\nítems: " + x.length);
    var listaItems=new Array();
  
    for (i = 0; i <x.length; i++) {                         
      itemTitulo=x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
      itemDescripcion=x[i].getElementsByTagName("description")[0].childNodes[0].nodeValue
      lat_long_radio=x[i].getElementsByTagName("circle")[0].childNodes[0].nodeValue;
      var arr = lat_long_radio.split(" ");
      itemLatitud=arr[0]/1; // con esto fuerzo la conversion numerica
      itemLongitud=arr[1]/1; // con esto fuerzo la conversion numerica
      itemRadio=arr[2]/1; // con esto fuerzo la conversion numerica
    
      itemFichero=x[i].getElementsByTagName("file")[0].childNodes[0].nodeValue;
      var tempItem=new item(itemTitulo, itemDescripcion, itemLatitud, itemLongitud, itemRadio, itemFichero);
      listaItems.push(tempItem);
      }//for
      return new paseo(titulo, descripcion, latitud, longitud, listaItems, latitud, longitud);
     
}//construyePaseo

function asignaEventos(paseo, audio, funcion_progreso)
{
    audio.ondurationchange =function() { console.log("ondurationchange"); };
    audio.onloadedmetadata = function() { console.log("onloadedmetadata"); };
    audio.onloadeddata = function() { console.log("onloadeddata"); };
    //audio.onprogress = function() { console.log("onprogress"); };
    audio.oncanplay = function() { console.log("oncanplay"); };

    audio.oncanplaythrough = function() { 
       paseo.audios_cargados++; 
       console.log("oncanplaythrough:"+ paseo.audios_cargados);
       funcion_progreso(paseo.audios_cargados); 
    };
                            // PROBLEMA: no operativo, en móviles no sirve de nada cargar los audio porque
                            // el objeto de audio solicita los archivos cada vez al servidor 
    ///// mas eventos
     audio.onsuspend	 = function() { console.log("onsuspend: browser is intentionally not getting media data"); };
    // resto de eventos
    audio.onabort = function() { console.log("onabort: Fires when the loading of an audio/video is aborted"); };
    audio.onemptied	 = function() { console.log("on current playlist is empty"); };
    audio.onended	 = function() { console.log("on current playlist is ended"); };
    audio.onerror	= function() { console.log("on  an error occurred during the loading of an audio/video"); };
    audio.onpause	 = function() { console.log("on audio/video has been paused"); };
    audio.onplay	 = function() { console.log("on audio/video has been started or is no longer paused"); };
    audio.onplaying	 = function() { console.log("on audio/video is playing after having been paused or stopped for buffering"); };
    audio.onratechange	 = function() { console.log("on playing speed of the audio/video is changed"); };
    audio.onseeked	 = function() { console.log("on user is finished moving/skipping to a new position in the audio/video"); };
    audio.onseeking	 = function() { console.log("on user starts moving/skipping to a new position in the audio/video"); };
    audio.onstalled	 = function() { console.log("on browser is trying to get media data, but data is not available"); };
    //audio.ontimeupdate	 = function() { console.log("on current playback position has changed"); };
    audio.onvolumechange	 = function() { console.log("on volume has been changed"); };
    audio.onwaiting	 = function() { console.log("on video stops because it needs to buffer the next frame"); };

 
}

function cargaAudiosLoad(paseo, funcion_progreso)
{
  for (i=0; i<paseo.listaItems.length; i++) {
     asignaEventos(paseo, paseo.listaItems[i].audio, funcion_progreso);
     paseo.listaItems[i].audio.load();
  }
                           // PROBLEMA: no operativo, en móviles no sirve de nada cargar los audio porque
                           // el objeto de audio solicita los archivos cada vez al servidor 
                           // funciona en PC pero no en moviles
                           // cuando el objeto audio solicita la carga, lo hace sin tener en cuenta la cache
                           // da igual que se cacheen los objetos con appcache.manifest, con carga explicita, con httprequest
                           // ni siquiera construyendo el objeto audio con src=window.URL.createObjectURL(blob);
                           // todo funciona en el ordenador pero deja de funcionar en el móvil
  
}

function cargaAudiosMuteSpeedPlay(paseo, funcion_progreso)
{
  //ultimo intento de precargar audio para minimizar el consumo de datos
  for (i=0; i<paseo.listaItems.length; i++) {
     asignaEventos(paseo, paseo.listaItems[i].audio, funcion_progreso);
     paseo.listaItems[i].audio.muted=true;
     paseo.listaItems[i].audio.playbackspeed=2;
     paseo.listaItems[i].audio.play();
  }
                       
}
// ayudas matematicas 
  
function distanciaHarvesine(lat1, lon1, lat2, lon2)
{
    var R = 6378137; // metros
    var dLat = (lat2-lat1)*Math.PI/180;
    var dLon = (lon2-lon1)*Math.PI/180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var d = R * c;
    return d;
}
  
function distanciaAngular(lat1, lat2)
{
    var d = 6378137 * (lat2-lat1)*Math.PI/180;
    return d;//metros
}

function puntoEnCirculo(puntoLat, puntoLong, circuloLat, circuloLong, circuloRadio)
{
  //están dentro del circulo todos aquellos puntos cuya distancia al centro es menor que el radio.
  // eso lo calculamos con la funcion de Harvesine
  // Pero como en la mayoría de las consultas van a estar fuera, aceleramos los calculos los que esten fuera del
  // cuadros excrito
  if (distanciaAngular(puntoLat, circuloLat)>=circuloRadio) return false;
  if (distanciaAngular(puntoLong, circuloLong)>=circuloRadio) return false;

  if (distanciaHarvesine(puntoLat, puntoLong, circuloLat, circuloLong)>=circuloRadio) return false;
  else return true; 
  // si hay problemas de rendimiento, se pude simplificar y usar las dos distacias angulares
  // como si fueran cartesianas -->distancia=raiz(distanciaLat*distanciaLat + distanciaLon*distanciaLon);
  // porque los circulos van a ser siempre muy pequeños en esta aplicación.
}    