// piechart.js
document.addEventListener('DOMContentLoaded', function() {
  fetch('/enedis-data').then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  }).then(data => {
    createPiechart(data.results);
  }).catch(error => {
    console.error('Error fetching Enedis data:', error);
  });
});

function createPiechart(data) {
  // Calculer la somme des valeurs pour le piechart
  const pieData = d3.pie()
    .value(d => d.value)(data);

  // Configuration du piechart
  const width = 450;
  const height = 450;
  const margin = 40;

  // Créer un radius qui est la moitié de la largeur ou la hauteur la plus petite
  const radius = Math.min(width, height) / 2 - margin;

  // Ajouter l'élément SVG au conteneur avec l'id 'piechart'
  const svg = d3.select('#piechart')
    .append('svg')
      .attr('width', width)
      .attr('height', height)
    .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

  // Créer un générateur d'arcs pour dessiner les sections du piechart
  const arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  // Construire le piechart
  svg.selectAll('slices')
    .data(pieData)
    .enter()
    .append('path')
      .attr('d', arcGenerator)
      .attr('fill', d => colorScale(d.data.categorie))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);

  // Ajouter les étiquettes de catégorie
  svg.selectAll('labels')
    .data(pieData)
    .enter()
    .append('text')
      .text(d => d.data.categorie)
      .attr('transform', d => `translate(${arcGenerator.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', 15);

  // Ajouter une légende si nécessaire
}

// Générateur de couleur - à personnaliser selon vos préférences ou vos données
function colorScale(categorie) {
  const scale = {
    'Catégorie 1': '#a05d56',
    'Catégorie 2': '#d0743c',
    'Catégorie 3': '#ff8c00'
    // Ajoutez autant de catégories que vous avez avec leurs couleurs respectives
  };
  return scale[categorie] || '#d8d8d8'; // Couleur par défaut si la catégorie n'est pas trouvée
}
