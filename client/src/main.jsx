import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./context/authContext.jsx";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthContextProvider>
);