// Function to create a table from the fetched data
function createTable(dataArray) {
  // Create table elements
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // Append thead and tbody to table
  table.appendChild(thead);
  table.appendChild(tbody);

  // Create and append the header row
  const headerRow = thead.insertRow();
  if (dataArray.length > 0) {
    Object.keys(dataArray[0]).forEach((key) => {
      const th = document.createElement("th");
      th.textContent = key.toUpperCase().replace(/_/g, " ");
      headerRow.appendChild(th);
    });
  }

  // Create and append the data rows
  dataArray.forEach((item) => {
    const row = tbody.insertRow();
    Object.values(item).forEach((value) => {
      const cell = row.insertCell();
      // Handle if value is an object (like 'geo_shape') differently, perhaps stringify
      cell.textContent = typeof value === "object" ? JSON.stringify(value) : value;
    });
  });

  // Set basic styles for visibility
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  table.querySelectorAll("th, td").forEach((cell) => {
    cell.style.border = "1px solid black";
    cell.style.padding = "5px";
    cell.style.textAlign = "left";
  });

  return table;
}
/*
document.getElementById("linkEdf").addEventListener("click", function (event) {
  event.preventDefault();
  fetch("/edf-data")
    .then((response) => response.json())
    .then((data) => {
      const displayArea = document.getElementById("displayArea");
      displayArea.innerHTML = ""; // Clear any previous content
      const table = createTable(data.results); // Use the createTable function to build the table
      displayArea.appendChild(table); // Append the table to the display area
    })
    .catch((error) => {
      console.error("Error fetching EDF data:", error);
      alert("Failed to fetch EDF data. Check console for more details.");
    });
});
*/



async function fetchAndDisplayEdfMap() {
  try {
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
  } catch (error) {
    console.error("Error fetching the EDF data or GeoJSON:", error);
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
        geometry: item.geo_shape.geometry // This assumes the geometry is correctly formatted
      })),
  };
}

function renderMap(world, edfData) {
  if (!edfData || !Array.isArray(edfData.results)) {
    console.error("Invalid EDF data:", edfData);
    return; // Exit the function if edfData is not valid
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

fetchAndDisplayEdfMap();
document.addEventListener("DOMContentLoaded", fetchAndDisplayEdfMap);




////////////////////////////////////////////////////////////////////////////////////
////////////////////////////'Enedis Data' link//////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

document.getElementById("linkEnedis").addEventListener("click", function (event) {
  event.preventDefault();
  fetch("/enedis-data") // Make sure this matches the route defined in your Express server
    .then((response) => response.json())
    .then((data) => {
      const displayArea = document.getElementById("displayArea");
      displayArea.innerHTML = ""; // Clear any previous content
      const table = createTable(data.results); // Use the createTable function to build the table
      displayArea.appendChild(table); // Append the table to the display area
    })
    .catch((error) => {
      console.error("Error fetching Enedis data:", error);
      alert("Failed to fetch Enedis data. Check console for more details.");
    });
});






////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Error handling  ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

// This function handles the display of error messages to the user
function displayErrorMessage(message) {
  const displayArea = document.getElementById('displayArea');
  displayArea.innerHTML = ''; // Clear any previous content
  const errorMessage = document.createElement('p');
  errorMessage.textContent = message;
  errorMessage.style.color = 'red';
  displayArea.appendChild(errorMessage);
}

// Function to show a loading message
function showLoading() {
  const displayArea = document.getElementById('displayArea');
  displayArea.innerHTML = 'Loading...'; // Display loading message
}

document.getElementById('linkEdf').addEventListener('click', function(event) {
  event.preventDefault();
  showLoading(); // Call this function to show the loading message
  fetch('/edf-data')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load EDF data.');
      }
      return response.json();
    })
    /*
    .then(data => {
      const displayArea = document.getElementById('displayArea');
      displayArea.innerHTML = '';
      const table = createTable(data.results);
      displayArea.appendChild(table);
    })*/
    .catch((error) => {
      console.error("Error fetching EDF data:", error);
      displayErrorMessage("Sorry, there was a problem retrieving the EDF data.");
    });
});


// Repeat the same pattern for Enedis data
document.getElementById('linkEnedis').addEventListener('click', function(event) {
  event.preventDefault();
  showLoading(); // Call this function to show the loading message
  fetch("/enedis-data")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load Enedis data.");
      }
      return response.json();
    })
    .then((data) => {
      const displayArea = document.getElementById("displayArea");
      displayArea.innerHTML = "";
      const table = createTable(data.results);
      displayArea.appendChild(table);
    })
    .catch((error) => {
      console.error("Error fetching Enedis data:", error);
      displayErrorMessage("Désolé, un problème est survenu lors de la récupération des données ENEDIS.");
    });
});



document.getElementById("linkEdf").addEventListener("click", function (event) {
  event.preventDefault();
  fetchAndDisplayEdfMap(); // Call the function to fetch and display the EDF data map
});

// Add a similar click event listener for the Enedis data link if it's not already there
document.getElementById("linkEnedis").addEventListener("click", function (event) {
  event.preventDefault();
  // Implement the fetch and display logic for Enedis data, which will display a table
  // Reuse or modify your existing createTable function as necessary
});
