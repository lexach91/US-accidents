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
        const csData = crossfilter(data);
        const all = csData.groupAll();
// id,severity,date,distance,description,city,county,state,zipcode,temperature,humidity,pressure,visibility,wind_direction,wind_speed,weather_condition,amenity,bump,crossing,give_way,junction,no_exit,railway,roundabout,station,stop,traffic_calming,traffic_signal,turning_loop,sunrise_sunset

        const stateDim = csData.dimension(dc.pluck("state"));
        const dateDim = csData.dimension(dc.pluck("date"));

        const accidentsByStateGroup = stateDim.group();

        d3.json("assets/data/us-states.json").then(mapJson => {
            mapChart
              .height(500)
              .dimension(stateDim)
              .group(accidentsByStateGroup)
            //   .colors(
            //     d3
            //       .scaleQuantize()
            //       .range([
            //         "#E2F2FF",
            //         "#C4E4FF",
            //         "#9ED2FF",
            //         "#81C5FF",
            //         "#6BBAFF",
            //         "#51AEFF",
            //         "#36A2FF",
            //         "#1E96FF",
            //         "#0089FF",
            //         "#0061B5",
            //       ])
            //   )
            //   .colorDomain([0, 200])
            //   .colorCalculator(function (d) {
            //     return d ? mapChart.colors()(d) : "#ccc";
            //   })
              .overlayGeoJson(mapJson.features, "state", function (d) {
                return d.properties.name;
              })
              .projection(d3.geoAlbersUsa())
              .valueAccessor(function (kv) {
                console.log(kv);
                return kv.value;
              });

              dc.renderAll();

        })
    });