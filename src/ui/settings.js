const store = require("electron-store");

const storage = new store();

export function getWindowSettings() {
  const defaultBounds = { width: 800, height: 600 };
  const savedBounds = storage.get("windowBounds");
  if (savedBounds) return savedBounds;
  else {
    storage.set("windowBounds", defaultBounds);
    return defaultBounds;
  }
}

export function saveBounds(boundsArray) {
  try {
    console.log("boundsArray: ", boundsArray);
    const width = boundsArray[0];
    const height = boundsArray[1];
    storage.set("windowBounds", { width, height });
  } catch (error) {
    console.log("error: ", error);
  }
  return;
}
