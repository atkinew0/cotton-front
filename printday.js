//let HOST = "http://localhost:3000"
let HOST = "http://10.1.10.131:3000"



window.onload = () => {

console.log("Running print day");

let print = document.querySelector("#printButton");

print.addEventListener("click", () => {
    window.print();
})


var xhr = new XMLHttpRequest();

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
    make_table(bales_list);


}
let d = new Date();
let time = d.getTime();
let lookback = time - (1000 * 60 * 60 * 12);   //get bales from last 12 hours


xhr.open('GET', `${HOST}/latest/${lookback}`);
xhr.send();

}


function make_table(bales_list){

    let table = document.querySelector("table");

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
    text = document.createTextNode("Gin");
    th5.appendChild(text);
    row.appendChild(th5);

    bales_list.forEach((bale, idx) => {
        
        let time = new Date(+bale.time);
        let hour = time.getHours();
        let minute = time.getMinutes().toString().padStart(2,'0');
        let seconds = time.getSeconds().toString().padStart(2,'0');

        let timeString = `${hour}:${minute}:${seconds}`
        bale.time = timeString;

        bale.Gin = 'N'
    })

    generateRows(table, bales_list)


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
