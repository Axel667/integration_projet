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
    .then(data => {
      const displayArea = document.getElementById('displayArea');
      displayArea.innerHTML = '';
      const table = createTable(data.results);
      displayArea.appendChild(table);
    })
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