function showLoading(type) {
  document.getElementById(`loadingMessage-${type}`).style.display = "block";
}

// Function to hide the loading message for the appropriate container
function hideLoading(type) {
  document.getElementById(`loadingMessage-${type}`).style.display = "none";
}

function displayEnedisHistogram() {
  clearDisplayAreas(() => {
    showLoading("enedis");
    initializeHistogram();
  });
}


function clearDisplayAreas(callback) {


  const displayAreaElement = document.getElementById("displayArea");
  if (displayAreaElement) {
    displayAreaElement.innerHTML = "";
  }

  if (callback) {
    callback();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  clearDisplayAreas();
});


/////////////////////////////////////  HISTOGRAM   //////////////////////////////////////////////

// Function to initialize and display the Enedis histogram
async function initializeHistogram() {

  showLoading("enedis");
  try {
    console.log("Fetching Enedis data...");
    const response = await fetch("/enedis-data");
    if (!response.ok) {
      throw new Error("Failed to load Enedis data.");
    }
    const enedisData = await response.json();
    console.log("Enedis data fetched:", enedisData.results);
  } catch (error) {
    console.error("Error fetching Enedis data:", error);
    displayErrorMessage("Désolé, un problème est survenu lors de la récupération des données ENEDIS.");
  } finally {
    hideLoading("enedis");
  }
  d3.select("#histogram").style("display", "block");
}


document.addEventListener("DOMContentLoaded", function () {
  d3.json("/enedis-data")
    .then(function (data) {
      const results = data.results;

      // Define the format tooltip function at the top
      const formatTooltip = d3.format(",.0f");

      // Unique categories for the color scale
      const categories = [...new Set(results.map((d) => d.categorie))];
      const colorScale = d3.scaleOrdinal().domain(categories).range(d3.schemeTableau10);

      // Set up the margins and dimensions
      const margin = { top: 10, right: 30, bottom: 70, left: 100 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      // Define the SVG container
      const svg = d3
        .select("#histogram")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Define scales and axes
      const x = d3
        .scaleBand()
        .range([0, width])
        .domain(results.map((d) => d.jour))
        .padding(0.1);

      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(results, (d) => +d.value)])
        .range([height, 0]);

      svg.append("g").call(d3.axisLeft(y));

      // Tooltip container
      const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

      // Bind the data to the bars and add event handlers
      const bars = svg
        .selectAll(".bar")
        .data(results)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.jour))
        .attr("y", (d) => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.value))
        .attr("fill", (d) => colorScale(d.categorie));

      // Tooltip event handlers
      bars
        .on("mouseover", function (event, d) {
          // Darken color on mouseover
          const color = d3.hsl(colorScale(d.categorie));
          color.l -= 0.2;
          d3.select(this).attr("fill", color.toString());

          // Show the tooltip
          tooltip
            .style("opacity", 1)
            .html(`Catégorie: ${d.categorie}<br>Valeur: ${formatTooltip(d.value)} W`)
            .style("left", event.pageX + "px")
            .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", function () {
          // Restore the bar color on mouseout
          d3.select(this).attr("fill", (d) => colorScale(d.categorie));
          tooltip.style("opacity", 0);
        });
    })
    .catch(function (error) {
      console.error("Error loading or parsing data:", error);
    });
});