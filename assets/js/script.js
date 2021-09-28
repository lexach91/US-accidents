const mapChart = dc.geoChoroplethChart("#us-map");
// 2016-02-08 00:37:08;

const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
d3.csv("assets/data/US_Accidents_Dec20_updated.csv")
    .catch(err => {throw err})
    .then(data => {
        data.forEach(d => {
            d.amenity = JSON.parse(d.amenity.toLowerCase());
            d.bump = JSON.parse(d.bump.toLowerCase());
            d.crossing = JSON.parse(d.crossing.toLowerCase());
            d.give_way = JSON.parse(d.give_way.toLowerCase());
            d.junction = JSON.parse(d.junction.toLowerCase());
            d.no_exit = JSON.parse(d.no_exit.toLowerCase());
            d.railway = JSON.parse(d.railway.toLowerCase());
            d.roundabout = JSON.parse(d.roundabout.toLowerCase());
            d.station = JSON.parse(d.station.toLowerCase());
            d.stop = JSON.parse(d.stop.toLowerCase());
            d.traffic_calming = JSON.parse(d.traffic_calming.toLowerCase());
            d.traffic_signal = JSON.parse(d.traffic_signal.toLowerCase());
            d.turning_loop = JSON.parse(d.turning_loop.toLowerCase());
            d.date = parseDate(d.date);
            d.distance = +d.distance;
            d.humidity = +d.humidity;
            d.pressure = +d.pressure;
            d.severity = +d.severity;
            d.temperature = +d.temperature;
            d.visibility = +d.visibility;
            d.wind_speed = +d.wind_speed;
            d.zipcode = +d.zipcode;
        })
        console.log(data)
        const csData = crossfilter(data);
    });