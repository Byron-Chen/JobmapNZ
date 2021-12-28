locations = [
    ["auckland", "-36.80816", "174.75440"],
    ["wellington", "-41.29507321855832", "174.77766554225585"],
    ["waikato", "-37.72390696352381", "175.21538947551178"],
    ["canterbury", "-43.50311238356835", "172.5876553652048"],
    ["hawkes bay", "-39.507111613250686", "176.90226488321053"],
    ["otago", "-45.88071408406402", "170.49788546905424"],
    ["bay of plenty", "-37.71209155167782", "176.14316152969974"],
    ["taranaki", "-39.07779262980466", "174.06046243430492"],
    ["manawatu", "-39.844543175870506", "175.53658789504829"],
    ["southland", "-46.355990602509046", "168.33956641148646"],
    ["tasman", "-41.50861597078496", "172.77188660327224"],
    ["northland", "-35.730603386218085", "174.2856496043747"],
    ["west coast", "-42.46026517738282", "171.20069891207208"],
    ["marlborough", "-41.51570907481636", "173.9675152825159"]
]


var the_map;
var infowindow;
var jobs_list;
var last_updated;
var heatcolors = ["#6BC17C", "#FCC47C", "#F86A6B"]
var sidebarjobslist = []

function init(){
    city_list = []
    for (let i = 0; i < jobs_list.length; i ++){
        job_info = []
        if (!find_city(jobs_list[i]["job_location"][0].toLowerCase(), city_list)){
            city_list.push([jobs_list[i]["job_location"][0].toLowerCase(), 0])
        }
        for (let j = 0; j < city_list.length; j++){
            if(city_list[j][0] == jobs_list[i]["job_location"][0].toLowerCase()){
                city_list[j][1] ++
                break
            }
        }
    }
    document.getElementById('updated').innerText = "Last updated at: " + last_updated
    display_city_data(city_list)
}

function display_city_data(city_list){
    for (let i = 0; i < city_list.length; i ++){
        place_markers(city_list[i][0], city_list[i][1])
    }
}

function find_city(cityf, cityl){
    for (let i =0; i < cityl.length; i ++){
        if (cityf == cityl[i][0]){
            return true
        }
    }
    return false
}

function initMap(){
    the_map = new google.maps.Map(document.getElementById('map'), {
		zoom:6, 
        mapId:"3471058186b2d43a",
		center: {lat:-41,  lng:172},
		disableDefaultUI: true,
        zoomControl: false,
	});

    infowindow = new google.maps.InfoWindow();
}

function place_markers(location_name, num){
    lat = 0;
    lng = 0;
    for (var i = 0; i < locations.length; i++){
        if (location_name == locations[i][0]){
            lat = locations[i][1]
            lng = locations[i][2]
            break
        }
    }

    var circlescale = num/500 * 10
    var circlesize = 0
    if (circlescale > 4){
        circlecolor = heatcolors[2]
        circlesize = 5
        
    }else if (circlescale > 1){
        circlecolor = heatcolors[1]
        circlesize = 3
    }else {
        circlecolor = heatcolors[0]
        circlesize = 2
    }

    var vmarker = {
        path: "M10,20 C10,10 25,10 25,20 25,30 10,30 10,20",
        fillColor: circlecolor,
        fillOpacity: .6,
        strokeWeight: 0,
        rotation: 0,
        scale: circlesize,
        anchor: new google.maps.Point(15, 20),
        labelOrigin: new google.maps.Point(17, 20),
    };


    var position = new google.maps.LatLng(lat, lng)
	var marker = new google.maps.Marker({
		position:position,
		map:the_map,
		icon:vmarker,
        label:{text: num.toString(), color:"black"}
	});
	//add info box when location is clicked
	google.maps.event.addListener(marker, 'click', function(){
        console.log("add")
        changeinfobox(location_name[0].toUpperCase() + location_name.substring(1), marker)
        update_sidebar(location_name)
        //list_jobs(location_name)
	})

}

function update_sidebar(location_name){
    document.getElementById('sidebar_city').innerText = location_name
    sidebarjobslist = []
    for (job in jobs_list){
        if(location_name == jobs_list[job]["job_location"][0].toLowerCase()){
            sidebarjobslist.push(jobs_list[job])
        }
    }
    list_jobs()
}

function changeinfobox(info, marker){
	//change the information popup box and pan to the target
	infowindow.close();
	infowindow.setContent('<div id="infowindow">'+ info +'</div>');
	infowindow.open(map, marker);
	//move the map to the target location
	//the_map.panTo({lat: parseFloat(location[2]), lng: parseFloat(location[3])});
}

function list_jobs(){
    document.getElementById("jobs_list").innerHTML = ""
    for (job in sidebarjobslist){
        console.log(sidebarjobslist[job])
        var jobelement = document.createElement("div")
        jobelement.setAttribute("class", "joblist")
        jobelement.innerHTML = '<a target="_blank" href="'+ sidebarjobslist[job]["job_link"] + '">'+sidebarjobslist[job]["job_title"]+'</a>';
        document.getElementById("jobs_list").appendChild(jobelement)
    }
}


let request = new XMLHttpRequest();
request.open('GET', 'data.json')
request.responseType = 'json'
request.send();

request.onload = function() {
    const jobs_json = request.response;
    jobs_list = jobs_json["jobs"]
    last_updated = jobs_json["date"]


}

window.onload = init;