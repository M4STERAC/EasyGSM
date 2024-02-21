import Store from 'electron-store';
import { Bounds } from "./utils/types";

//Initialize electron store
const storage = new Store();

/**
 * Retrieves the window settings from storage.
 * If no settings are found, default settings are set and returned.
 * @returns {Bounds} The window settings object.
 */
export function getWindowSettings(): Bounds {
  const defaultBounds = { width: 800, height: 600 };
  const savedBounds: Bounds = storage.get("windowBounds") as Bounds;
  if (savedBounds) return savedBounds;
  else {
    storage.set("windowBounds", defaultBounds);
    return defaultBounds;
  }
}

/**
 * Saves the window bounds to storage.
 * @param {Bounds} bounds - The window bounds object to save to electron store.
 * @property {number} bounds.width - The window width.
 * @property {number} bounds.height - The window height.
 * @returns {void}
 */
export function saveBounds(bounds: Bounds): void {
  try {
    const newBounds: Bounds = { width: bounds.width, height: bounds.height };
    storage.set("windowBounds", newBounds);
  } catch (error) {
    console.error("error: ", error);
  }
  return;
}