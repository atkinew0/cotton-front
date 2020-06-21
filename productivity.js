
function make_graph(bales_list){


    let data = process_data(bales_list)
    draw_graph(data);

}

function process_data(bales_list){


    let d = new Date();
    d.setHours(0);
    let time = d.getTime();

    let data = []

    for(let i = 0; i < 24; i++){

        data.push({time: time, count: 0});
        time += 1000 * 60 * 60;

    }

    //TODO add COUNTS to our time cutoffs
    //Mutate the TIME cutoffs into proper hour numbers for D3 to process







    // data = [{
    //     date: 2009,
    //     wage: 7.25
    // }, {
    //     date: 2008,
    //     wage: 6.55
    // }, {
    //     date: 2007,
    //     wage: 5.85
    // }, {
    //     date: 1997,
    //     wage: 5.15
    // }, {
    //     date: 1996,
    //     wage: 4.75
    // }, {
    //     date: 1991,
    //     wage: 4.25
    // }, {
    //     date: 1981,
    //     wage: 3.35
    // }, {
    //     date: 1980,
    //     wage: 3.10
    // }, {
    //     date: 1979,
    //     wage: 2.90
    // }, {
    //     date: 1978,
    //     wage: 2.65
    // }]

    return data;


}

function draw_graph(data){


    const body1 = d3.select("body");

    d3.select("svg").remove()

body1.append("svg").attr("width", 800).attr("height", 600);



var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
}

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//making graph responsive
default_width = 700 - margin.left - margin.right;
default_height = 500 - margin.top - margin.bottom;
default_ratio = default_width / default_height;

// Determine current size, which determines vars
function set_size() {
    current_width = window.innerWidth;
    current_height = window.innerHeight;
    current_ratio = current_width / current_height;
    // desktop
    if (current_ratio > default_ratio) {
        h = default_height;
        w = default_width;
        // mobile
    } else {
        margin.left = 40
        w = current_width - 40;
        h = w / default_ratio;
    }
    // Set new width and height based on graph dimensions
    width = w - 50 - margin.right;
    height = h - margin.top - margin.bottom;
};
set_size();
//end responsive graph code


// format the data
data.forEach(function (d) {
    
    let category = new Date(d.time);

    let hour = category.getHours();
    let minutes = category.getMinutes();

    d.time = `${hour}:${minutes}`;
    d.count = +d.count;
});
//sort the data by date so the trend line makes sense
// data.sort(function (a, b) {
//     return a.time - b.time;
// });

// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Scale the range of the data
x.domain(d3.extent(data, function (d) {
    return d.time;
}));
y.domain([0, d3.max(data, function (d) {
    return d.count;
})]);

// define the line
var valueline = d3.line()
    .x(function (d) {
        return x(d.time);
    })
    .y(function (d) {
        return y(d.count);
    });

// append the svg object to the body of the page
var svg = d3.select("#prod").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


// Add the trendline
svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline)
    .attr("stroke", "#32CD32")
    .attr("stroke-width", 2)
    .attr("fill", "#FFFFFF");

// Add the data points
var path = svg.selectAll("dot")
    .data(data)
    .enter().append("circle")
    .attr("r", 5)
    .attr("cx", function (d) {
        return x(d.time);
    })
    .attr("cy", function (d) {
        return y(d.count);
    })
    .attr("stroke", "#32CD32")
    .attr("stroke-width", 1.5)
    .attr("fill", "#FFFFFF")
    .on('mouseover', function (d, i) {
        d3.select(this).transition()
            .duration('100')
            .attr("r", 7);
        div.transition()
            .duration(100)
            .style("opacity", 1);
        div.html("$" + d3.format(".2f")(d.count))
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 15) + "px");
    })
    .on('mouseout', function (d, i) {
        d3.select(this).transition()
            .duration('200')
            .attr("r", 5);
        div.transition()
            .duration('200')
            .style("opacity", 0);
    });

// Add the axis
if (width < 500) {
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5));
} else {
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
}

svg.append("g")
    .call(d3.axisLeft(y).tickFormat(function (d) {
        return "$" + d3.format(".2f")(d)
    }));

}



