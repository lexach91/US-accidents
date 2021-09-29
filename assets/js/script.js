const mapChart = dc.geoChoroplethChart("#us-map");
const weatherChart = dc.pieChart("#weather-selector");
const timelineChart = dc.barChart("#timeline");
const totalNumber = dc.numberDisplay("#total-num");

const parseDate = d3.timeParse("%Y-%m-%d");
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
            d.date = parseDate(d.date.slice(0, 10));
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

        const stateDim = csData.dimension(dc.pluck("state"));
        const dateDim = csData.dimension(dc.pluck("date"));
        const weatherDim = csData.dimension(dc.pluck("weather_condition"));


        const accidentsByStateGroup = stateDim.group();
        const weatherGroup = weatherDim.group();
        const dateGroup = dateDim.group();

        d3.json("assets/data/us-states.json").then(mapJson => {
            mapChart
              .height(500)
              .width(870)
              .dimension(stateDim)
              .group(accidentsByStateGroup)
              .overlayGeoJson(mapJson.features, "state", function (d) {
                return d.properties.name;
              })
              .projection(d3.geoAlbersUsa())
            //   .valueAccessor(function (kv) {
            //     // console.log(kv);
            //     return kv.value;
            //   });

            weatherChart
              .height(350)
              .width(350)
              .dimension(weatherDim)
              .group(weatherGroup)
              .data(group => group.top(10))
            //   .elasticX(true);


            timelineChart
              .width(1300)
              .height(300)
              .dimension(dateDim)
              .group(dateGroup)
              .elasticY(true)
              .x(
                d3
                  .scaleTime()
                  .domain([dateDim.bottom(1)[0].date, dateDim.top(1)[0].date])
              );

            totalNumber
              // .dimension(csData)
              .group(all)
              .valueAccessor((x) => x)
              .formatNumber(d3.format("d"));
              // .html({
              //     one:'%number record',
              //     some:'%number records',
              //     none:'no records'})
            //   .transitionDuration(1700)
            //   .formatNumber(d3.format("f"));

            
            dc.renderAll();

        })
    });