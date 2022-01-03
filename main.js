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
var oldpagenum;
var displayboxopened = false;
var displayboxid = null;
var displayboxold;

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
    console.log(city_list)
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
        gestureHandling: "none",
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

    var vmarkerhover = {
        path: "M10,20 C10,10 25,10 25,20 25,30 10,30 10,20",
        fillColor: circlecolor,
        fillOpacity: 1,
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
        //changeinfobox(location_name[0].toUpperCase() + location_name.substring(1), marker)
        update_sidebar(location_name)
        //list_jobs(location_name)
	})

    google.maps.event.addListener(marker, 'mouseover', function(){
        marker.setIcon(vmarkerhover)
	})
    google.maps.event.addListener(marker, 'mouseout', function(){
        marker.setIcon(vmarker)
	})

}

function first_letter_upper(str){
    return str[0].toUpperCase() + str.substring(1)
}

function update_sidebar(location_name){
    document.getElementById('sidebar_city').innerText = first_letter_upper(location_name)
    sidebarjobslist = []
    for (job in jobs_list){
        if(location_name == jobs_list[job]["job_location"][0].toLowerCase()){
            sidebarjobslist.push(jobs_list[job])
        }
    }
    pagenum = Math.ceil(sidebarjobslist.length/20)
    
    //page number bottom
    document.getElementById("pagenumber").innerHTML = "<p class='inline'>Page: </p>"
    for(i=0;i<pagenum;i++){
        numelement = document.createElement("a")
        numelement.setAttribute("class", "mx-1 hover:underline")
        numelement.setAttribute("id", "pagenum"+(i+1).toString())
        numelement.setAttribute("href", 'javascript:list_jobs('+ (i+1) + ')')
        numelement.innerHTML = (i+1).toString()
        //numelement.innerHTML = '<a href="javascript:list_jobs('+ (i+1) + ')">'+ (i+1).toString()+'</a>';
        document.getElementById("pagenumber").appendChild(numelement)
    }
    list_jobs(1)

}

function changeinfobox(info, marker){
	//change the information popup box and pan to the target
	infowindow.close();
	infowindow.setContent('<div id="infowindow">'+ info +'</div>');
	infowindow.open(map, marker);
	//move the map to the target location
	//the_map.panTo({lat: parseFloat(location[2]), lng: parseFloat(location[3])});
}

function convert_date(date){
    d = a.split(' ')[0].slice(-1);
    t = a.split(b)[0];
    //last_updated
    if (d == "d"){
        
    }

}

function display_job_info(jobid){
    console.log(joblistpage[jobid])
    jobdisplay = document.getElementById("job" + jobid) 
    //displayboxold = jobdisplay.innerHTML '<a href="' + joblistpage[jobid]["job_link"] + '">'+ 
    console.log('<a href="' + joblistpage[jobid]["job_link"] + '">')
    jobdisplayfigurehtml =  '<figure id="displaybox" class="overflow-hidden bg-blue-200 rounded p-8 md:p-0">'
    jobdisplayinfohtml = '<a class=" overflow-hidden" target="_blank" href="' + joblistpage[jobid]["job_link"] + '">'+ 
    '<div class="text-black text-sm ml-3 float-left clear-both w-full">'+ joblistpage[jobid]["job_description"][0]+'</div>'  +
    '<div class="text-black text-sm ml-3 float-left clear-both w-full">'+ joblistpage[jobid]["job_company"]+'</div>'  +
    '<div class="text-black text-sm ml-3 float-left clear-both w-full">'+ joblistpage[jobid]["job_date"]+'</div></a>'
    + '</figure>' //+ '</a>'

    console.log(jobdisplayfigurehtml + jobdisplayinfohtml)
    
    console.log(displayboxid)
    if(displayboxopened && displayboxid != jobid ){
        document.getElementById("displaybox").remove()
        document.getElementById('job' + displayboxid).innerHTML = displayboxold
        displayboxold = jobdisplay.innerHTML
       
        
        jobdisplay.innerHTML = jobdisplayfigurehtml + jobdisplay.innerHTML + jobdisplayinfohtml
        displayboxopened = true
        displayboxid = jobid
    } else if (!displayboxopened){
        displayboxold = jobdisplay.innerHTML
        jobdisplay.innerHTML = jobdisplayfigurehtml + jobdisplay.innerHTML + jobdisplayinfohtml
        displayboxopened = true
        displayboxid = jobid
    }else{
        document.getElementById("displaybox").remove()
        document.getElementById('job' + displayboxid).innerHTML = displayboxold
        
        
        displayboxopened = false
    }
}

function list_jobs(page_num){
    displayboxopened = false;
    displayboxid = null;

    //page number 
    joblistpage = sidebarjobslist.slice((page_num-1)*20, page_num*20)
    if (oldpagenum){
        document.getElementById("pagenum" + oldpagenum.toString()).setAttribute("class", "mx-1 hover:underline")
    }
    oldpagenum = page_num
    document.getElementById("pagenum" + page_num.toString()).setAttribute("class", "mx-1 hover:underline underline") //FIZX THINGISHGNIDJ

    //listing jobs
    document.getElementById("jobs_list").innerHTML = ""
    for (job in joblistpage ){
        jobelement = document.createElement("div")
        jobelement.setAttribute("id", "job" + job)
        jobelement.setAttribute("class", "clear-both")
        //jobelement.setAttribute("href", 'javascript:display_job_info('+ job + ')')
        jobelement.innerHTML = '<a class="hover:underline float-left position-relative ml-3" href= ' + 'javascript:display_job_info('+ job + ')' + '>'+joblistpage[job]["job_title"]+'</a>';
        //jobelement.innerHTML = '<p class="hover:underline" target="_blank" href="'+ joblistpage[job]["job_link"] + '">'+joblistpage[job]["job_title"]+'</p>';
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