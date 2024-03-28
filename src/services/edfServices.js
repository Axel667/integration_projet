import fetch from "node-fetch";


// Assuming you need to prepend a base URL to the endpoint
const BASE_URL = "https://opendata.edf.fr";
const API_ENDPOINT =
  "/api/explore/v2.1/catalog/datasets/emissions-de-co2-consolidees-par-pays-du-groupe-edf/records?limit=100";

const getEdfData = async () => {
  const url = `${BASE_URL}${API_ENDPOINT}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch Edf data: ${error}`);
    throw error;
  }
};

export { getEdfData };
