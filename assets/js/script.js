dc.config.defaultColors(d3.schemeCategory10); //Changing default DC.js color scheme

// Creating variables for charts
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
const dayOfWeekChart = dc.rowChart("#day-of-week-chart");

const dataUrl = "https://query.data.world/s/5c54uvvfqkeg6vtct5tquymi4nbe7f"; // Link to dataset hosted at data.world

// Variables for parsing and formatting date
const parseDate = d3.timeParse("%Y-%m-%d");
const formatDate = d3.timeFormat("%Y-%m-%d");

d3.csv(dataUrl) // Fetching the dataset by creating a promise with D3 library
  .catch((err) => {
    document.getElementById("error").style.display = "block"; //If we catch an error while fetching data, an error will be shown to user
    throw err;
  })
  .then((data) => {
    data.forEach((d) => {
      d.date = parseDate(d.date.slice(0, 10)); //Parsing a date from a date column in dataset
    });

    //Adding variables for all data with crossfilter library
    const csData = crossfilter(data);
    const all = csData.groupAll();

    // Creating dimensions that will be used for building charts
    const stateDim = csData.dimension(dc.pluck("state"));
    const dateDim = csData.dimension(dc.pluck("date"));
    const weatherDim = csData.dimension(dc.pluck("weather_condition"));
    const dayNightDim = csData.dimension(dc.pluck("sunrise_sunset"));
    const severityDim = csData.dimension(dc.pluck("severity"));
    const statesDim = csData.dimension(dc.pluck("state"));
    const countiesDim = csData.dimension(dc.pluck("county"));
    const citiesDim = csData.dimension(dc.pluck("city"));
    const dayOfWeekDim = csData.dimension((d) => {
      const day = d.date.getDay();
      const week = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return week[day];
    });

    // Grouping all dimensions
    const accidentsByStateGroup = stateDim.group();
    const weatherGroup = weatherDim.group();
    const dateGroup = dateDim.group();
    const dayNightGroup = dayNightDim.group();
    const severityGroup = severityDim.group();
    const statesGroup = statesDim.group();
    const countiesGroup = countiesDim.group();
    const citiesGroup = citiesDim.group();
    const dayOfWeekGroup = dayOfWeekDim.group();

    // Another d3 promise to load geojson file for building a map of USA
    d3.json("assets/data/us-states.json").then((mapJson) => {
      // Map chart
      mapChart
        .height(500)
        .width(870)
        .dimension(stateDim)
        .group(accidentsByStateGroup)
        .overlayGeoJson(mapJson.features, "state", function (d) {
          return d.properties.name;
        })
        .projection(d3.geoAlbersUsa())
        .title(function (d) {
          return (
            "State: " +
            d.key +
            "\nNumber of accidents: " +
            (d.value ? d.value : 0)
          );
        })
        .useViewBoxResizing(true);

      // Weather selector chart
      weatherChart
        .height(350)
        .width(550)
        .dimension(weatherDim)
        .group(weatherGroup)
        .data((group) => group.top(10))
        .legend(dc.legend())
        .innerRadius(50)
        .minAngleForLabel(100)
        .cx(350)
        .title(function (d) {
          return (
            "Weather conditions: " +
            d.key +
            "\nNumber of accidents: " +
            (d.value ? d.value : 0)
          );
        })
        .useViewBoxResizing(true);

      //Top 10 states by amount of accidents chart
      topStatesChart
        .height(700)
        .width(900)
        .dimension(statesDim)
        .group(statesGroup)
        .data((group) => group.top(10))
        .elasticX(true)
        .title(function (d) {
          return (
            "State: " +
            d.key +
            "\nNumber of accidents: " +
            (d.value ? d.value : 0)
          );
        })
        .useViewBoxResizing(true)
        .xAxis()
        .ticks(6);

      //Top 10 counties by amount of accidents chart
      topCountiesChart
        .height(700)
        .width(900)
        .dimension(countiesDim)
        .group(countiesGroup)
        .data((group) => group.top(10))
        .elasticX(true)
        .title(function (d) {
          return (
            "County: " +
            d.key +
            "\nNumber of accidents: " +
            (d.value ? d.value : 0)
          );
        })
        .useViewBoxResizing(true)
        .xAxis()
        .ticks(6);

      //Top 10 cities by amount of accidents chart
      topCitiesChart
        .height(700)
        .width(900)
        .dimension(citiesDim)
        .group(citiesGroup)
        .data((group) => group.top(10))
        .elasticX(true)
        .title(function (d) {
          return (
            "City: " +
            d.key +
            "\nNumber of accidents: " +
            (d.value ? d.value : 0)
          );
        })
        .useViewBoxResizing(true)
        .xAxis()
        .ticks(6);

      // Timeline chart
      timelineChart
        .width(1300)
        .height(300)
        .dimension(dateDim)
        .group(dateGroup)
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .useViewBoxResizing(true)
        .margins({ top: 30, right: 10, bottom: 30, left: 50 })
        .x(
          d3
            .scaleTime()
            .domain([dateDim.bottom(1)[0].date, dateDim.top(1)[0].date])
        )
        .xAxis()
        .ticks(30);

      //Total number of selected accidents
      totalNumber
        .group(all)
        .valueAccessor((x) => x)
        .formatNumber(d3.format("d"));

      // Day-night selector chart
      dayNightChart
        .height(250)
        .width(300)
        .dimension(dayNightDim)
        .title(function (d) {
          return (
            "Time of a day: " +
            d.key +
            "\nNumber of accidents: " +
            (d.value ? d.value : 0)
          );
        })
        .group(dayNightGroup)
        .useViewBoxResizing(true);

      // Severity of an impact on traffic chart
      severityChart
        .height(300)
        .width(1000)
        .dimension(severityDim)
        .group(severityGroup)
        .ordering((d) => {
          if (d.key == "Little or no impact") {
            return 0;
          } else if (d.key == "Light impact") {
            return 1;
          } else if (d.key == "Medium impact") {
            return 2;
          } else {
            return 3;
          }
        })
        .elasticX(true)
        .title(function (d) {
          return (
            "Severity of an impact on traffic: " +
            d.key +
            "\nNumber of accidents: " +
            (d.value ? d.value : 0)
          );
        })
        .useViewBoxResizing(true);

      // Table on aggregated data
      dataTable
        .dimension(dateDim)
        .showSections(false)
        .size(30)
        .useViewBoxResizing(true)
        .columns([
          {
            label: "Date",
            format: function (d) {
              return formatDate(d.date);
            },
          },
          "state",
          "county",
          "city",
          "description",
        ])
        .useViewBoxResizing(true);

      // Day of a week chart
      dayOfWeekChart
        .height(400)
        .width(1000)
        .dimension(dayOfWeekDim)
        .group(dayOfWeekGroup)
        .elasticX(true)
        .ordering((d) => {
          const order = {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6,
          };
          return order[d.key];
        })
        .title(function (d) {
          return (
            "Day of a week: " +
            d.key +
            "\nNumber of accidents: " +
            (d.value ? d.value : 0)
          );
        })
        .useViewBoxResizing(true);

      dc.renderAll(); //Function that draws all charts

      // Hiding the loader and displaying the page after all charts are drawn
      document.getElementById("loader").style.display = "none";
      document.getElementsByClassName("container")[0].style.display = "block";
      document.getElementsByTagName("header")[0].style.display = "block";
      document.getElementsByTagName("footer")[0].style.display = "flex";
    });
  });
