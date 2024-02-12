const store = require("electron-store");

const storage = new store();

function getWindowSettings() {
  const defaultBounds = { width: 800, height: 600 };
  const savedBounds = storage.get("windowBounds");
  if (savedBounds) return savedBounds;
  else {
    storage.set("windowBounds", defaultBounds);
    return defaultBounds;
  }
}

function saveBounds(bounds) {
  try {
    console.log("bounds: ", bounds);
    const newBounds = { width: bounds.width, height: bounds.height };
    storage.set("windowBounds", newBounds);
  } catch (error) {
    console.log("error: ", error);
  }
  return;
}

module.exports = { getWindowSettings, saveBounds };