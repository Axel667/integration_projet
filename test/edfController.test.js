// edfController.test.js
import request from "supertest";
import app from "../src/app.js"; // Import your Express application
import { fetchData } from "../src/controllers/edfController.js";

// Mock the `getEdfData` service to control its behavior
jest.mock("../src/services/edfServices.js", () => ({
  getEdfData: jest.fn().mockResolvedValue({
    /* mock data */
  }),
}));

describe("EDF Data Controller", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear any previous data
  });

  it("should fetch EDF data successfully", async () => {
    // Setup the mock to resolve with some data
    const mockData = { result: "some data" };
    getEdfData.mockResolvedValue(mockData);

    const response = await request(app).get("/edf-data");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockData);
    expect(getEdfData).toHaveBeenCalledTimes(1);
  });

  it("should handle errors when fetching EDF data fails", async () => {
    // Setup the mock to reject with an error
    const mockError = new Error("Failed to fetch data");
    getEdfData.mockRejectedValue(mockError);

    const response = await request(app).get("/edf-data");

    expect(response.statusCode).toBe(500);
    expect(response.text).toContain("Server error");
    expect(getEdfData).toHaveBeenCalledTimes(1);
  });
});
