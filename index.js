let HOST = "http://localhost:3000"


window.onload = () => {

    let baleCount = 0;
    let response;

    showHistorical();

    //SETUP xhr request
    var xhr = new XMLHttpRequest();
    var xhr2 = new XMLHttpRequest();

    xhr2.onload = function() {

        let response;

        if (xhr2.status >= 200 && xhr2.status < 300) {
            // This will run when the request is successful
            
            response = JSON.parse(xhr2.response);
        } else {
            // This will run when it's not
            console.log('The request failed!');
        }

        let gin = document.getElementById("gin");
        gin.innerText = response.gin;

        console.log('Get response',response)


    }

    xhr.onload = function () {

        // Process our return data
        if (xhr.status >= 200 && xhr.status < 300) {
            // This will run when the request is successful
            
            response = JSON.parse(xhr.response);
        } else {
            // This will run when it's not
            console.log('The request failed!');
        }
    
        let bales_list = response.bales.list;     //list is an array of bales
        let d = new Date()
        let cutoff = d.getTime() - (1000 * 60 * 60);  //to get bales from last hour
        
        showBales(bales_list, 0)            //note bales cutoff being implemnted server side for now
        showAverage(bales_list)
       
        var current = document.getElementById("#current");
    
        
    };

   xhr2.open('GET', `${HOST}/gin`)
   xhr2.send();

    setInterval(()=> {
        console.log("bales read");
        baleCount++;

        let d = new Date()
        let cutoff = d.getTime() - (1000 * 60 * 60);        //get bales from last 1 hour

        //xhr.open('GET', 'http://10.1.10.78:3000/latest');
        xhr.open('GET', `${HOST}/latest/${cutoff}`);

        xhr.send();


    }, 10000);
}

function showBales(bales_list, cutoff){

    var viewer = document.getElementById("currentdisplay");
   

    let bales = []
    let shownBales = document.getElementsByClassName("bale");
    let shownTags = []

    for(let i = 0; i < shownBales.length; i++){
        shownTags.push(shownBales[i].tagNumber);
    }

    console.log('Already shown tagnumbers found', shownTags);

    // for(key in bales_data){
    //     if(bales_data[key].time > cutoff){
    //         bales.push(bales_data[key]);
    //     }
    // }

    //make an array of ONLY bales that are not alread in the DOM
    // for(key in bales_data){
    //     if(!shownTags.includes(bales_data[key].tag)){
    //         bales.push(bales_data[key]);
    //     }
    // }

    bales_list.forEach(bale => {
        if(!shownTags.includes(bale.tag)){
            bales.push(bale)
        }
    })

    console.log("After filter bales to show of ", bales.length);

    for(let i = 0; i < bales.length; i++){

        var bale = document.createElement("div");
        var icon = document.createElement("img");
        icon.setAttribute("src","cotton.png");
        
        bale.classList.add("bale");
        viewer.appendChild(bale);
        
        let time = new Date(+bales[i].time);
        console.log('Time read at ',time.getDate());

        let hour = time.getHours();
        let minute = time.getMinutes();
        let second = time.getSeconds();
        let ampm = time.get
    
        bale.innerHTML = `<p>Tag: ${bales[i].tag} Weight:${bales[i].weight}  at ${hour}:${minute}:${second}</p>`
        bale.tagNumber = bales[i].tag;
        //bale.appendChild(icon);

    }
    

}

function showAverage(bales_list){

    let balesPerHour = document.getElementById("bph");
    let minPerBale = document.getElementById("pb");

    if(bales_list.length < 2){
        return;
    }

    let firstBaleTime = Infinity;
    let lastBaleTime = -Infinity;

    
    bales_list.forEach(bale => {

        console.log("Bale time ",bale.time)
        if(bale.time < firstBaleTime) firstBaleTime = bale.time
        if(bale.time > lastBaleTime) lastBaleTime = bale.time

    })
        
    

    let baleTimeSpan = lastBaleTime - firstBaleTime;

    console.log("First bale and last bale at for a diff of", firstBaleTime, lastBaleTime, baleTimeSpan)

    let avgTimeMin = Math.floor((baleTimeSpan/bales_list.length)/(1000*60))
    let avgTimeSec = Math.floor(((baleTimeSpan/bales_list.length)/1000)%60).toString().padStart(2,'0');

    let avgTime = `${avgTimeMin}:${avgTimeSec}`

    minPerBale.innerText = avgTime;
    balesPerHour.innerText = (60/((baleTimeSpan/bales_list.length)/(1000*60))).toPrecision(3);


}

function showHistorical(){

    let xhr = new XMLHttpRequest();

    xhr.onload = function() {

        let response;

        if (xhr.status >= 200 && xhr.status < 300) {
            // This will run when the request is successful
            
            response = JSON.parse(xhr.response);
        } else {
            // This will run when it's not
        console.log('The request failed!');
        }

        let bales_list = response.bales.list; 

        var viewer = document.getElementById("histdisplay");
        
        let bales = []
        let shownBales = document.getElementsByClassName("histbale");
        let shownTags = []
    
        for(let i = 0; i < shownBales.length; i++){
            shownTags.push(shownBales[i].tagNumber);
        }

        bales_list.forEach(bale => {
            if(!shownTags.includes(bale.tag)){
                bales.push(bale)
            }
        })
    
    
        for(let i = 0; i < bales.length; i++){
    
            var bale = document.createElement("div");
            var icon = document.createElement("img");
            icon.setAttribute("src","cotton.png");
            
            bale.classList.add("histbale");
            viewer.appendChild(bale);
            
            let time = new Date(+bales[i].time);
    
            let hour = time.getHours();
            let minute = time.getMinutes();
            let second = time.getSeconds();
            let ampm = time.get
        
            bale.innerHTML = `<p>Tag: ${bales[i].tag} Weight:${bales[i].weight}  at ${hour}:${minute}:${second}</p>`
            bale.tagNumber = bales[i].tag;
            //bale.appendChild(icon);
    
        }



    }

    let d = new Date();
    let lastDay = d.getTime() - (1000 * 60 * 60 * 12);   //get bales from last 12 hours

    xhr.open('GET', `${HOST}/latest/${lastDay}`);
    xhr.send();


}

    


