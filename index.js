window.onload = () => {

    let baleCount = 0;
    let bales_data;

    //SETUP xhr request
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {

        // Process our return data
        if (xhr.status >= 200 && xhr.status < 300) {
            // This will run when the request is successful
            console.log('success!', xhr);
            bales_data = JSON.parse(xhr.response);
        } else {
            // This will run when it's not
            console.log('The request failed!');
        }
    

        let d = new Date()
        let cutoff = d.getTime() - (1000 * 60 * 60);  //to get bales from last hour
        
        showBales(bales_data, 0)            //note bales cutoff being implemnted server side for now
       
        var current = document.getElementById("#current");
    
        
    };

   

    setInterval(()=> {
        console.log("bales read");
        baleCount++;

        xhr.open('GET', 'http://10.1.10.78:3000/latest');
        xhr.send();


    }, 10000);
}

function showBales(bales_data, cutoff){

    var viewer = document.getElementById("currentdisplay");


    console.log("the type of bales_data IS...", typeof bales_data)
   

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
    for(key in bales_data){
        if(!shownTags.includes(bales_data[key].tag)){
            bales.push(bales_data[key]);
        }
    }

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
    
        bale.innerText = `Tag: ${bales[i].tag} Weight:${bales[i].weight}  at ${hour}:${minute}:${second}`
        bale.tagNumber = bales[i].tag;
        bale.appendChild(icon);

    }
    


}


    


