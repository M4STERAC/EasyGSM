const store = require("electron-store");

//Initialize electron store
const storage = new store();

/**
 * Retrieves the window settings from storage.
 * If no settings are found, default settings are set and returned.
 * @returns {Object} The window settings object.
 */
function getWindowSettings() {
  const defaultBounds = { width: 800, height: 600 };
  const savedBounds = storage.get("windowBounds");
  if (savedBounds) return savedBounds;
  else {
    storage.set("windowBounds", defaultBounds);
    return defaultBounds;
  }
}

/**
 * Saves the window bounds to storage.
 * @param {Object} bounds - The window bounds object to save to electron store.
 * @property {number} bounds.width - The window width.
 * @property {number} bounds.height - The window height.
 * @returns {undefined}
 */
function saveBounds(bounds) {
  try {
    const newBounds = { width: bounds.width, height: bounds.height };
    storage.set("windowBounds", newBounds);
  } catch (error) {
    console.error("error: ", error);
  }
  return;
}

module.exports = { getWindowSettings, saveBounds };