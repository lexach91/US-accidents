# _US Traffic Accidents Data Visualization_

---

[US Traffic Accidents](https://lexach91.github.io/US-accidents/) is a dashboard with interactive charts that visualize data about car accidents that occurred from 2016 to 2020 on the territory of 49 states of the USA.

![site on different devices](assets/documentation/am-i-responsive.png)

---

## Technologies used

- HTML
- CSS
- Javascript
- [D3.js library](https://d3js.org/)
- [DC.js library](https://dc-js.github.io/dc.js/)
- [Crossfilter library](https://square.github.io/crossfilter/)
- [Google fonts](https://fonts.google.com/)
- [Font awesome](https://fontawesome.com/)

---

## User stories

- As a first-time visitor, I want to understand the purpose of the website so I can use it properly.
- As a first-time visitor, I want to see the titles of each chart, so I can understand what data they represent.
- As a first-time visitor, I want to see what technologies have been used to create the website, so I can learn more about them and use them myself.
- As a first-time visitor, I want to see some information about the website developer, so I can contact them.
- As a user of the website, I want to see what filters are currently applied on each chart, so I can analyze visualized data correctly.
- As a user of the website, I want to be able to reset applied filters for each chart, so I can switch filters I'm not currently interested in.
- As a mobile device user, I want the website to be mobile-friendly, so I can use my tablet or smartphone to visit it.

---

## Charts

- #### USA Map Chart
    ![USA map](assets/documentation/us-map.png)

    - This chart shows amount of accidents by state, plotted on interactive map
    - Each state can be clicked to apply filters to other charts
    - Hovering above each state will show a tooltip with the name of the state and the amount of accidents
    - Chart created with DC.js library (dc.geoChoroplethChart)

- #### Total number
    ![Number of selected accidents](assets/documentation/total-number.png)

    - This element shows total amount of accidents on the load of the page and changing when filters on other charts are applied.
    - Element created with DC.js library (dc.numberDisplay)

- #### Weather conditions chart
    ![Weather pie chart](assets/documentation/weather-selector.png)

    - This pie chart shows top 10 weather conditions during accidents.
    - Each weather condition can be clicked to apply filters to other charts
    - Hovering above each weather condition will show a tooltip with the name of the weather condition and the amount of accidents
    - Chart created with DC.js library (dc.pieChart)

- #### Timeline chart
    ![Timeline bar chart](assets/documentation/timeline.png)

    - This bar chart shows accidents distribution by date from February 2016 to December 2020
    - User can select a period of time with the mouse to apply filters to other charts
    - Chart created with DC.js library (dc.barChart)

- #### Top 10 States, Counties, And Cities
    ![Top 10 States, Counties, And Cities row charts](assets/documentation/tops.png)

    - These row charts show top 10 States, Counties, and Cities by the amount of accidents
    - Each row can be clicked to apply filters to other charts
    - Hovering above each row will show a tooltip with the name of the state, county, or city and the amount of accidents
    - Charts created with DC.js library (dc.rowChart)