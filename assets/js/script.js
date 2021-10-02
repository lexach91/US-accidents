const mapChart = dc.geoChoroplethChart("#us-map");
const weatherChart = dc.pieChart("#weather-selector");
const timelineChart = dc.barChart("#timeline");
const totalNumber = dc.numberDisplay("#total-num");
const dayNightChart = dc.pieChart("#day-night");
const severityChart = dc.rowChart("#severity")
// const scatterLocationChart = dc.scatterPlot("#scatter-location");

const dataUrl =
  "https://media.githubusercontent.com/media/lexach91/US-accidents/main/assets/data/US_Accidents_Dec20_updated.csv";

  
const parseDate = d3.timeParse("%Y-%m-%d");


d3.csv("https://query.data.world/s/3cjklaknwxpa2wqy4326n6t4yiqb33")
  .catch((err) => {
    throw err;
  })
  .then((data) => {
    data.forEach((d) => {      
      d.date = parseDate(d.date.slice(0, 10));
      d.distance = +d.distance;
      d.humidity = +d.humidity;
      d.pressure = +d.pressure;
      d.severity = +d.severity;
      d.temperature = +d.temperature;
      d.visibility = +d.visibility;
      d.wind_speed = +d.wind_speed;
      d.lat = +d.lat;
      d.lng = +d.lng;
    });
    const csData = crossfilter(data);
    const all = csData.groupAll();

    const stateDim = csData.dimension(dc.pluck("state"));
    const dateDim = csData.dimension(dc.pluck("date"));
    const weatherDim = csData.dimension(dc.pluck("weather_condition"));
    const dayNightDim = csData.dimension(dc.pluck("sunrise_sunset"));
    const severityDim = csData.dimension(dc.pluck("severity"));
    const locationsDim = csData.dimension((d) => [d.lng, d.lat]);

    const accidentsByStateGroup = stateDim.group();
    const weatherGroup = weatherDim.group();
    const dateGroup = dateDim.group();
    const dayNightGroup = dayNightDim.group();
    const severityGroup = severityDim.group();
    const locationGroup = locationsDim.group();

    d3.json("assets/data/us-states.json").then((mapJson) => {
      mapChart
        .height(500)
        .width(870)
        .dimension(stateDim)
        .group(accidentsByStateGroup)
        .overlayGeoJson(mapJson.features, "state", function (d) {
          return d.properties.name;
        })
        .projection(d3.geoAlbersUsa());


      weatherChart
        .height(350)
        .width(550)
        .dimension(weatherDim)
        .group(weatherGroup)
        .data((group) => group.top(10))
        .legend(dc.legend())
        .innerRadius(50)
        .minAngleForLabel(100);
      

      timelineChart
        .width(1300)
        .height(300)
        .dimension(dateDim)
        .group(dateGroup)
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .margins({ top: 30, right: 10, bottom: 30, left: 50 })
        .x(
          d3
            .scaleTime()
            .domain([dateDim.bottom(1)[0].date, dateDim.top(1)[0].date])
        )
        .xAxis()
        .ticks(30);

      totalNumber
        .group(all)
        .valueAccessor((x) => x)
        .formatNumber(d3.format("d"));
      

      dayNightChart.dimension(dayNightDim).group(dayNightGroup);

      severityChart        
        .dimension(severityDim)
        .group(severityGroup)
        .ordering((d) => {
          if (d.value == 1) {
            return 0;
          } else if (d.value === 2) {
            return 1;
          } else if (d.value === 3) {
            return 2;
          } else {
            return 3;
          }
        })        
        .elasticX(true);

      scatterLocationChart
        .height(500)
        .width(870)
        .useCanvas(true)
        .dimension(locationsDim)
        .group(locationGroup)
        .x(d3.scaleLinear().domain([-125, -65]))
        .data(group => group.top(100000))
        .brushOn(false)
        .keyAccessor(function (d) {
          return d.key[0];
        })
        .valueAccessor(function (d) {
          return d.key[1];
        })
        .highlightedSize(4)
        .symbolSize(3)
        .excludedSize(2)
        .excludedOpacity(0.5)
        .excludedColor("#ddd");

      dc.renderAll();

      document.getElementById("loader").style.display = "none";
    });
  });