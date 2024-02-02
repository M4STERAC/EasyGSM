import axios from "axios";

export async function getAllServerData(address) {
  for (let i = 0; i < 3; i++) {
    try {
      const response = await axios.get(address);
      return response.data;
    } catch (error) {
      console.error("Error fetching server data:", error);
      console.error("Retrying...");
    }
  }
}
