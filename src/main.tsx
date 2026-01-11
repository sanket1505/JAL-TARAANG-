import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// Update this line to point to the components folder
import "./i18n.ts"; 

createRoot(document.getElementById("root")!).render(<App />);