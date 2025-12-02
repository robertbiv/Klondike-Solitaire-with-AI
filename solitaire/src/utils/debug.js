// Debug logging shared by components (UI) and game/AI logic.
// How to use:
// - UI: call setDebugLogger(fn) once to receive logs in your console/panel.
// - Logic: call debugLog(message, data) anywhere to publish an event.
// A short-window de-dupe helps filter duplicate logs in development.

let debugLogCallback = null;
let __lastLogSig = null;
let __lastLogTime = 0;

const makeSig = (message, data) => {
    try {
        return `${message}|${data ? JSON.stringify(data) : ''}`;
    } catch {
        return message;
    }
};

/**
 * Register a single log handler used by the Debug UI.
 * Typically set once in a component with useEffect, and cleaned on unmount.
 */
export function setDebugLogger(callback) {
    debugLogCallback = callback;
}

/**
 * Publish a debug event to the registered handler.
 * Safe to call from anywhere (components, hooks, or pure logic files).
 */
export function debugLog(message, data) {
    const now = Date.now();
    const sig = makeSig(message, data);
    // Avoid dev-time duplicate logs from StrictMode by deduping in a short window
    if (__lastLogSig === sig && now - __lastLogTime < 200) return;
    __lastLogSig = sig;
    __lastLogTime = now;
    if (typeof debugLogCallback === 'function') debugLogCallback(message, data);
}

export default debugLog;
