// main.js

// Define map projection
const projection = d3.geoMercator().scale(100).center([0, 40]);
const pathGenerator = d3.geoPath().projection(projection);

// Define the div for the tooltip
const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

// Fetch the data and create the map
fetch("/api/edf-data")
  .then((response) => response.json())
  .then((data) => {
    // Assume data.results is an array of your records
    const geojsonData = data.results.map((record) => record.geo_shape);

    // Select the SVG element and plot each geojson feature
    const svg = d3.select("#map");
    svg
      .selectAll(".country")
      .data(geojsonData)
      .enter()
      .append("path")
      .attr("class", "country")
      .attr("d", pathGenerator)
      .attr("fill", "steelblue")
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`CO2 Emissions: ${d.properties.emissions_co2} ktonnes`)
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function (d) {
        tooltip.transition().duration(500).style("opacity", 0);
      });
  })
  .catch((error) => console.error("Error fetching EDF data:", error));
