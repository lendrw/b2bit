import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { AppRoutes } from "./shared/routes/AppRoutes";
import { AuthProvider } from "./shared/contexts/AuthContext/AuthProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
