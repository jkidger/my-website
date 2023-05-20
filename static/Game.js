let locations = [];
let details = [];
let found = [];
let guesses = [];
let timer = -99;
let TIME_LIMIT = 120;
//let startLat = 51.453;
//let startLong = -2.498;
let startLat = 0;
let startLong = 0;
let start = { lat: startLat, lng: startLong }; // Start location
let radius = 1000;
let keyword = ""
let type = ""
let numLocs = 10;
let map = null;
let marker = null;
const API_KEY = "AIzaSyAtPxK2aqnMaZZPWg9E9Fo5olhjX8G-aLE" // hide this dummy - although it is website bound so 'hopefully' can't be abused - pls be nice :)

var startLoc = window.prompt("Enter start location: (eg home town)");
var searchQuery = window.prompt("Enter thing to search for: (eg pubs)");

function initMap() {
  // The map, centered at the start location
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: start,
  });
  
  // The marker, positioned at start location
  marker = new google.maps.Marker({
    position: start,
    map: map,
    icon: {
      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    },
    title: "Start Location",
  });
  
  // add new markers by clicking 
  map.addListener("click", (mapsMouseEvent) => { addGuess(mapsMouseEvent.latLng); });
}

function addGuess(latLng) {
  newGuess = new google.maps.Marker({position: latLng, map: map}); // create new marker
  
  newGuess.addListener("click", (e) => {
    removeGuess(e.latLng);
  });
  
  guesses.push(newGuess); // add marker
  print("Added new marker at: " + latLng);
  printGuesses();
  
  result = checkGuess(latLng);
  if (result != null) {
    print("location found! location: " + result);
    found.push(result);
    
    //print("printing found list:");
    //for (let i = 0; i < found.length; i++) {
      //print(found[i]);
    //}
    //print("printing locations list:");
    //for (let i = 0; i < locations.length; i++) {
      //print(locations[i]);
    //}
  }
}

function removeGuess(latLng) {
  index = -1;
  for (let i = 0; i < guesses.length; i++) {
    guess = guesses[i];
    if (guess.position == latLng) {
      index = i;
      break;
    }
  }
  print("the index is: " + index);
  guesses[index].setMap(null);
  guesses.splice(index,1);
  printGuesses();
}

function printGuesses() {
  print("Guesses:");
  for (let i = 0; i < guesses.length; i++) {
    print("" + guesses[i].position);
  }
  print("");
}

function checkGuess(latLng) {
  //print("checking " + latLng)
  //print(""+latLng.lat())
  //print(""+latLng.lng())
  // check down to 4 decimal places
  lat = parseFloat(latLng.lat().toFixed(4));
  lng = parseFloat(latLng.lng().toFixed(4));
  //print("lat: " + lat + " long: " + lng);
  for (let i = 0; i < locations.length; i++) {
  //print("against " + locations[i][1] + " " + locations[i][2])
    locLat = parseFloat(locations[i][1].toFixed(4));
    locLon = parseFloat(locations[i][2].toFixed(4));
    
    if (lat == locLat && lng == locLon) {
      return [locations[i][0], locations[i][1], locations[i][2]]
    }
  }
  return null
}

function search(radius) {
  var request = {
    location: start,
    radius: radius,
    keyword: [searchQuery],
    //type: [type]
  };
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, searchCallback);
}

function searchCallback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    //print("printing results!")
    for (var i = 0; i < results.length; i++) {
      name = results[i].name;
      lat = results[i].geometry.location.lat()
      lng = results[i].geometry.location.lng()
      //print(name + " " + lat + " " + lng);
      if (i < numLocs) {
        locations.push([name, lat, lng, 0])
      } else {
        break;
      }
    }
  }
}

function findPlace() {
  var request = {
    query: startLoc,
    fields: ["name", "geometry"]
  };
  service = new google.maps.places.PlacesService(map);
  service.findPlaceFromQuery(request, findPlaceCallback);
}

function findPlaceCallback(result, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    print("printing search result!")
    print(result[0]);
    startLat = result[0].geometry.location.lat()
    startLong = result[0].geometry.location.lng()
    print("lat: " + startLat);
    print("long: " + startLong);
    start = { lat: startLat, lng: startLong };
    map.setCenter(start);
    marker.setPosition(start);
    }
    
    //for (var i = 0; i < results.length; i++) {
    //  name = results[i].name;
    //  lat = results[i].geometry.location.lat()
    //  lng = results[i].geometry.location.lng()
    //  //print(name + " " + lat + " " + lng);
    //  if (i < numLocs) {
    //    locations.push([name, lat, lng, 0])
    //  } else {
    //    break;
    //  }
    //}
  //}
}

function contains(listA, thingB) {
  aaa = thingB;
    for (let j = 0; j < listA.length; j++) {
      bbb = listA[j];
      if (aaa[0] == bbb[0]) {
        return true;
      }
    }
    return false;
}

function genLocationText() {
  loc = "";
  for (let i = 0; i < locations.length; i++) {
    aaa = locations[i];
    if (contains(found, aaa)) {
      print(aaa[0] + " has been found! striking it now");
      loc = loc + "\n" + "---" + locations[i][0] + "---";
    } else {
      loc = loc + "\n" + locations[i][0];
    }
  }
  return loc;
}

function endGame() {
  map.setCenter(start);
  map.setZoom(14);
  
  endMarkers = [];
  for (let i = 0; i < locations.length; i++) {
    latLong = { lat: locations[i][1], lng: locations[i][2] }
    endMarkers.push(new google.maps.Marker({position:latLong, map:map, icon:{url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"}, title:locations[i][0],}));
  }
}

function getMissed() {
  missed = []
  for (let i = 0; i < locations.length; i++) {
    aaa = locations[i];
    if (!contains(found, aaa)) {
      missed.push(aaa);
    }
  }
  return missed;
}

function concatNames(list) {
  out = ""
  for (let i = 0; i < list.length; i++) {
    out = out + "\n" + list[i][0];
  }
  return out;
}

function setup() {
  findPlace();
  setTimeout(() => {
    search(radius);
    setTimeout(() => {
      print("printing locations array")
      for (let i = 0; i < locations.length; i++) {
        print(locations[i][0] + " " + locations[i][1] + "  " + locations[i][2]);
      }
      createCanvas(800,320);
      window.initMap = initMap; // initialize map
      timer = TIME_LIMIT
    }, 1000);
  }, 1000);
}

function draw() {
  print(timer);
  background(220);
  if (timer > 0 && found.length < locations.length) {
    locationText = genLocationText();
    textAlign(CENTER, TOP);
    textSize(15);
    text(locationText, width/2, 0);
  
  
    textAlign(CENTER, BOTTOM);
    textSize(20);
    text("Time left: "+timer, width/2, height); // add timer to screen
  
    if (frameCount % 60 == 0 && timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
      timer --;
    }
  } else if (timer == 0 && found.length < locations.length) {
    text("GAME OVER", width/2, height/2);
    endGame();
    if (frameCount % 120 == 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
      timer = - 2;
    }
    setTimeout(() => {timer = -2}, 2000);
  } else if (found.length == locations.length) {
    text("Well done!", width/2, height/2);
    endGame();
    if (frameCount % 120 == 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
      timer = - 2;
    }
  } else if (timer == -99) {
    print("waiting to start...");
  } else if (timer == -2) {
    numMissed = locations.length - found.length;
    missedLocs = getMissed();
    missed = concatNames(missedLocs);
    textAlign(CENTER, TOP);
    textSize(15);
    text("Missed " + numMissed + " locations:\n" + missed, width/2, 0);
    
    textAlign(CENTER, BOTTOM);
    textSize(20);
    text("Your score: " + found.length + " / " + locations.length,  width/2, height);
  }
}
