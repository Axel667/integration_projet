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

      // Extraction des catégories uniques
      const categories = [...new Set(results.map(d => d.categorie))];

      // Création d'une échelle de couleurs pour les catégories
      const colorScale = d3.scaleOrdinal()
        .domain(categories)
        .range(d3.schemeTableau10); // Vous pouvez choisir n'importe quel schéma de couleurs ici

      // Configuration de l'histogramme
      const margin = { top: 10, right: 30, bottom: 70, left: 100 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      // Ajouter l'élément SVG à la div avec l'id 'histogram'
      const svg = d3
        .select("#histogram")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Création de l'échelle pour l'axe X
      const x = d3
        .scaleBand()
        .range([0, width])
        .domain(results.map((d) => d.jour))
        .padding(0.1);

      // Création de l'axe X
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      // Ajout d'un titre pour l'axe X
      svg
        .append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
        .style("text-anchor", "middle")
        .text("Dates");

      // Création de l'échelle pour l'axe Y
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(results, (d) => +d.value)])
        .range([height, 0]);

      // Création de l'axe Y
      svg.append("g").call(d3.axisLeft(y));

      // Ajout d'un titre pour l'axe Y
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Valeurs (W)");

      // Fonction de formatage pour les infobulles
      const formatTooltip = d3.format(",.0f");

      // Fonction pour ajuster la luminosité de la couleur
      function adjustBrightness(color, amount) {
        const hsl = d3.hsl(color);
        hsl.l += amount;
        hsl.l = Math.max(0, Math.min(1, hsl.l)); // Assurez-vous que la luminosité reste entre 0 et 1
        return hsl.toString();
      }

      // Création des barres avec gestion des événements
      svg.selectAll(".bar")
      .data(results)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.jour))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", d => colorScale(d.categorie))
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", adjustBrightness(colorScale(d.categorie), -0.2)); // Assombrir la couleur
        // Afficher l'infobulle ici
        d3.select("#tooltip")
          .style("opacity", 1)
          .html(`Catégorie: ${d.categorie}<br>Valeur: ${formatTooltip(d.value)} W`)
          .style("left", event.pageX + 5 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function (event, d) {
        d3.select(this).attr("fill", colorScale(d.categorie)); // Réattribuer la couleur originale
        // Cacher l'infobulle ici
        d3.select("#tooltip").style("opacity", 0);
      });

      // Ajouter une infobulle dans le HTML avec l'id 'tooltip' et le style initial 'opacity: 0'
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("id", "tooltip")
        .attr("class", "tooltip")
        .style("opacity", 0);
    })
    .catch(function (error) {
      console.error("Error loading or parsing data:", error);
    });
});

