"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveBounds = exports.getWindowSettings = void 0;
var electron_store_1 = require("electron-store");
//Initialize electron store
var storage = new electron_store_1.default();
/**
 * Retrieves the window settings from storage.
 * If no settings are found, default settings are set and returned.
 * @returns {Bounds} The window settings object.
 */
function getWindowSettings() {
    var defaultBounds = { width: 800, height: 600 };
    var savedBounds = storage.get("windowBounds");
    if (savedBounds)
        return savedBounds;
    else {
        storage.set("windowBounds", defaultBounds);
        return defaultBounds;
    }
}
exports.getWindowSettings = getWindowSettings;
/**
 * Saves the window bounds to storage.
 * @param {Bounds} bounds - The window bounds object to save to electron store.
 * @property {number} bounds.width - The window width.
 * @property {number} bounds.height - The window height.
 * @returns {void}
 */
function saveBounds(bounds) {
    try {
        var newBounds = { width: bounds.width, height: bounds.height };
        storage.set("windowBounds", newBounds);
    }
    catch (error) {
        console.error("error: ", error);
    }
    return;
}
exports.saveBounds = saveBounds;
