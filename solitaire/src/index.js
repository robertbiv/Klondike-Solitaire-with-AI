/**
 * Application entry point.
 * 
 * Renders the root App component into the DOM.
 * React 18's createRoot enables concurrent features.
 * 
 * Note: DndProvider is actually set up in App.jsx, not here.
 * This file just bootstraps React and loads global styles.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; 

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <DndProvider backend={HTML5Backend}>
            <App />
        </DndProvider>
    </React.StrictMode>
)