dc.config.defaultColors(d3.schemeCategory10);
const mapChart = dc.geoChoroplethChart("#us-map");
const weatherChart = dc.pieChart("#weather-selector");
const timelineChart = dc.barChart("#timeline");
const totalNumber = dc.numberDisplay("#total-num");
const dayNightChart = dc.pieChart("#day-night");
const severityChart = dc.rowChart("#severity");
const topStatesChart = dc.rowChart("#top-states");
const topCountiesChart = dc.rowChart("#top-counties");
const topCitiesChart = dc.rowChart("#top-cities");
const dataTable = dc.dataTable("#data-table");

const dataUrl = "https://query.data.world/s/3cjklaknwxpa2wqy4326n6t4yiqb33";
// const dataUrl = "assets/data/US_Accidents_Dec20_updated.csv";

const parseDate = d3.timeParse("%Y-%m-%d");
const formatDate = d3.timeFormat("%Y-%m-%d");

d3.csv(dataUrl)
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
    const statesDim = csData.dimension(dc.pluck("state"));
    const countiesDim = csData.dimension(dc.pluck("county"));
    const citiesDim = csData.dimension(dc.pluck("city"));

    const accidentsByStateGroup = stateDim.group();
    const weatherGroup = weatherDim.group();
    const dateGroup = dateDim.group();
    const dayNightGroup = dayNightDim.group();
    const severityGroup = severityDim.group();
    const statesGroup = statesDim.group();
    const countiesGroup = countiesDim.group();
    const citiesGroup = citiesDim.group();

    d3.json("assets/data/us-states.json").then((mapJson) => {
      mapChart
        .height(500)
        .width(870)
        .dimension(stateDim)
        .group(accidentsByStateGroup)
        .overlayGeoJson(mapJson.features, "state", function (d) {
          return d.properties.name;
        })
        .projection(d3.geoAlbersUsa())
        .useViewBoxResizing(true);

      weatherChart
        .height(350)
        .width(550)
        .dimension(weatherDim)
        .group(weatherGroup)
        .data((group) => group.top(10))
        .legend(dc.legend())
        .innerRadius(50)
        .minAngleForLabel(100)
        .useViewBoxResizing(true);

      topStatesChart
        .height(700)
        .width(900)
        .dimension(statesDim)
        .group(statesGroup)
        .data((group) => group.top(10))
        .elasticX(true)
        .useViewBoxResizing(true);

      topCountiesChart
        .height(700)
        .width(900)
        .dimension(countiesDim)
        .group(countiesGroup)
        .data((group) => group.top(10))
        .elasticX(true)
        .useViewBoxResizing(true);

      topCitiesChart
        .height(700)
        .width(900)
        .dimension(citiesDim)
        .group(citiesGroup)
        .data((group) => group.top(10))
        .elasticX(true)
        .useViewBoxResizing(true);

      timelineChart
        .width(1300)
        .height(300)
        .dimension(dateDim)
        .group(dateGroup)
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        // .mouseZoomable(true)
        .useViewBoxResizing(true)
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

      dayNightChart
        .height(300)
        .width(300)
        .dimension(dayNightDim)
        .group(dayNightGroup)
        .useViewBoxResizing(true);

      severityChart
        .height(300)
        .width(1000)
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
        .elasticX(true)
        .useViewBoxResizing(true);

      dataTable
        .dimension(dateDim)
        .showSections(false)
        .size(20)
        .useViewBoxResizing(true)
        .columns([
          {
            label: "Date",
            format: function (d) {
              return formatDate(d.date);
            },
          },
          "city",
          "county",
          "state",
          "description",
        ])
        .useViewBoxResizing(true);

      dc.renderAll();

      document.getElementById("loader").style.display = "none";
      document.getElementsByClassName("container")[0].style.display = "block";
    });
  });
