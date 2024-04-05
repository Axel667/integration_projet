

function showLoading(type) {
  document.getElementById(`loadingMessage-${type}`).style.display = "block";
}

// Function to hide the loading message for the appropriate container
function hideLoading(type) {
  document.getElementById(`loadingMessage-${type}`).style.display = "none";

  
}
// Function to display the EDF map
function displayEdfMap() {
  currentVisualization = "EDF";
  clearDisplayAreas(() => {
    showLoading("edf");
    fetchAndDisplayEdfMap();
  });
}

// Function to display the Enedis histogram
function displayEnedisHistogram() {
  currentVisualization = "Enedis";
  clearDisplayAreas(() => {
    showLoading("enedis");
    initializeHistogram();
  });
}

// Event listeners for the EDF and Enedis buttons
document.getElementById("linkEdf").addEventListener("click", displayEdfMap);
document.getElementById("linkEnedis").addEventListener("click", displayEnedisHistogram);


function clearDisplayAreas(callback) {
  document.getElementById("map").style.display = "none";
  document.getElementById("histogram").style.display = "none";
  document.getElementById("displayArea").innerHTML = ""; // Vider le contenu précédent s'il existe
  if (callback) {
    callback();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  clearDisplayAreas();
});

/////////////////////////////////////  MAP   //////////////////////////////////////////////

async function fetchAndDisplayEdfMap() {
   // Ensure this element is in your HTML

  try {
    showLoading("edf");
    const edfResponse = await fetch("/edf-data");
    const edfData = await edfResponse.json();
    console.log("EDF Data:", edfData); // Log the data to check its structure

    const geoResponse = await fetch("/custom.geo.json");
    const world = await geoResponse.json();
    console.log("World GeoJSON:", world); // Log the data to check its structure

    if (!edfData || !edfData.results || !Array.isArray(edfData.results)) {
      throw new Error("EDF data is not in expected format");
    }

    renderMap(world, edfData); // Pass both the world and EDF data to the render function
     
    hideLoading("edf");
  } catch (error) {
    console.error("Error fetching the EDF data or GeoJSON:", error);

    hideLoading("displayArea");
  }
}

function mergeData(countries, edfData) {
  // Check if edfData.results is an array here. If not, log an error.
  if (!Array.isArray(edfData.results)) {
    console.error("edfData.results is not an array:", edfData);
    return countries;
  }

  countries.forEach((country) => {
    // Find the matching EDF data for this country using edfData.results
    const match = edfData.results.find((d) => d.spatial_perimeter === country.properties.name);
    if (match) {
      country.properties.edfData = match;
    }
  });

  return countries;
}

function convertEdfDataToGeoJSON(edfData) {
  return {
    type: "FeatureCollection",
    features: edfData.results
      .filter((item) => item.geo_shape && item.geo_shape.geometry)
      .map((item) => ({
        type: "Feature",
        properties: {
          tri: item.tri,
          annee: item.annee,
          perimetre_juridique: item.perimetre_juridique,
          legal_perimeter: item.legal_perimeter,
          perimetre_spatial: item.perimetre_spatial,
          spatial_perimeter: item.spatial_perimeter,
          emissions_co2: item.emissions_co2,
          unite: item.unite,
          methode_de_consolidation: item.methode_de_consolidation,
          consolidation_method: item.consolidation_method,
          // Add any other properties you want to visualize or use in tooltips
        },
        geometry: item.geo_shape.geometry, // This assumes the geometry is correctly formatted
      })),
  };
}

function renderMap(world, edfData) {
  if (!edfData || !Array.isArray(edfData.results)) {
    console.error("Invalid EDF data:", edfData);
    return; // Exit the function if edfData is not valid
  }
  if (currentVisualization !== "EDF") {
    return; // Stop the rendering process if we're no longer in the EDF context
  }
  const countries = mergeData(world.features, edfData);

  const width = 960;
  const height = 600;

  const svg = d3.select("#map").attr("width", width).attr("height", height);

  const projection = d3.geoMercator().fitSize([width, height], world);
  const pathGenerator = d3.geoPath().projection(projection);

  const colorScale = d3
    .scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(edfData.results, (d) => d.emissions_co2)]);

  // Enhanced country path styling
  svg
    .selectAll(".country")
    .data(countries)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", pathGenerator)
    .attr("fill", (d) => (d.properties.edfData ? colorScale(d.properties.edfData.emissions_co2) : "#ddd")) // Light grey for no data
    .attr("stroke", "#fff") // White border
    .attr("stroke-width", 0.5);

  // Tooltip setup
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid #ddd")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("display", "none") // Start hidden
    .style("pointer-events", "none");

  // Tooltip interactivity
  svg
    .selectAll(".country")
    .on("mouseover", function (event, d) {
      d3.select(this).attr("stroke", "black").attr("stroke-width", 1.5); // Highlight border
      tooltip
        .style("display", "block")
        .html(generateTooltipContent(d.properties.edfData)) // Function to generate HTML content based on data
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + 10 + "px");
    })
    .on("mousemove", function (event) {
      tooltip.style("left", event.pageX + 10 + "px").style("top", event.pageY + 10 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).attr("stroke", "#fff").attr("stroke-width", 0.5); // Reset border
      tooltip.style("display", "none");
    });
     d3.select("#map").style("display", "block");
}

// Helper function to generate tooltip content
function generateTooltipContent(data) {
  if (!data) {
    return "No data available";
  }
  // Create HTML content with your data. For example:
  return `<strong>${data.spatial_perimeter}</strong><br>
          Emissions: ${data.emissions_co2.toFixed(2)} ktonnes<br>
          Year: ${data.annee}`;
}





/////////////////////////////////////  HISTOGRAM   //////////////////////////////////////////////

// Function to initialize and display the Enedis histogram
async function initializeHistogram() {
  if (currentVisualization !== "Enedis") {
    return; // Stop the rendering process if we're no longer in the EDF context
  }
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
  }finally {
    hideLoading("enedis");
  }
  d3.select("#histogram").style("display", "block");
}




