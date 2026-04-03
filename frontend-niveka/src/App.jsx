import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/AuthPage";
import ResetPassword from "./components/ui/ResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
