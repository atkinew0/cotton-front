let HOST = config.HOST;


window.onload = () => {

    let baleCount = 0;
    let response;


    //SETUP xhr request
    var xhr = new XMLHttpRequest();
    var xhr2 = new XMLHttpRequest();
    var xhr3 = new XMLHttpRequest();

    xhr3.onload = function() {

        let response;

        if (xhr3.status >= 200 && xhr3.status < 300) {
            // This will run when the request is successful
            
            response = JSON.parse(xhr3.response);
        } else {
            // This will run when it's not
            console.log('The request failed!');
        }

        let bales_list = response.bales.list;
        make_graph(bales_list);


    }

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
        let cutoff = d.getTime() - (1000 * 60 * 60 * 12);  //to get bales from last 12 hours
        
        showBales(bales_list, 0)            //note bales cutoff being implemnted server side for now
        
       
        var current = document.getElementById("#current");
    
        
    };

   xhr2.open('GET', `${HOST}/gin`)
   xhr2.send();

    setInterval(()=> {
        
        baleCount++;

        //get bales from last 12 hours

        //xhr.open('GET', 'http://10.1.10.78:3000/latest');
        xhr.open('GET', `${HOST}/today`);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send();


    }, 10000);

    setInterval(() => {

        let d = new Date();
        
        let time = d.getTime();
        let lookback = time - (1000 * 60 * 60 * 10); 


        xhr3.open('GET', `${HOST}/latest/${lookback}`);
        xhr3.send();

    }, 10000)
}

function showBales(bales_list, cutoff){


    let existingTable = document.getElementsByTagName("table");
    if(existingTable != null) existingTable[0].remove();

    let ct = document.querySelector("#ct");
    ct.innerText = bales_list.length


    make_table(bales_list)
    

}



    
function make_table(bales_list){

    let current = document.querySelector("#currentdisplay")
    let table = document.createElement("table");
    current.appendChild(table);
   

    //generate table head
    let thead = table.createTHead();
    let row = thead.insertRow();

    let th1 = document.createElement("th");
    text = document.createTextNode("Bale");
    th1.appendChild(text);
    row.appendChild(th1);

    let th2 = document.createElement("th");
    text = document.createTextNode("Time");
    th2.appendChild(text);
    row.appendChild(th2);

    let th3 = document.createElement("th");
    text = document.createTextNode("Tag");
    th3.appendChild(text);
    row.appendChild(th3);

    let th4 = document.createElement("th");
    text = document.createTextNode("Weight");
    th4.appendChild(text);
    row.appendChild(th4);

    let th5 = document.createElement("th");
    text = document.createTextNode("# of Min");
    th5.appendChild(text);
    row.appendChild(th5);

    bales_list.forEach((bale, idx) => {
        
        let time = new Date(+bale.time);
        let hour = time.getHours();
        let ampm = hour >= 12 ? "pm" : "am";
        hour = hour > 12 ? hour = hour - 12: hour;
        let minute = time.getMinutes().toString().padStart(2,'0');
        let second = time.getSeconds().toString().padStart(2,'0');

        
        bale.time = `${hour}:${minute}:${second} ${ampm}`

        bale.interval = millisToMin(bale.interval)

    })

    generateRows(table, bales_list);


}

function millisToMin(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

function generateRows(table, data) {

    let baleCt = 1;
    console.log("In data is ", data, typeof data)

    for (let element of data) {
        console.log("for element",element)
      let row = table.insertRow();
      let c = row.insertCell();
      c.appendChild(document.createTextNode(+(baleCt++)))

      for (key in element) {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
      }
    }
  }


