import fs from "fs";

export async function getAllServers(jsonFile) {
  for (let i = 0; i < 3; i++) {
    try {
      const servers = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
      console.log(servers);
      return servers;
    } catch (error) {
      console.error("Error fetching server data:", error);
      console.error("Retrying...");
    }
  }
}

export async function addServer(data) {
  for (let i = 0; i < 3; i++) {
    try {
      const servers = fs.readFileSync(jsonFile).toString("utf-8");
      console.log(servers);
      servers.push(data);
      const updatedJson = JSON.stringify(servers, null, 2);
      return { statusCode: 200, data: updatedJson }
    } catch (error) {
      console.error("Error adding server:", error);
      console.error("Retrying...");
    }
  }
}