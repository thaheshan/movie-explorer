import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/AuthPage";
import ResetPassword from "./components/ui/ResetPassword";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ui/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* / → redirect to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* /login → login page */}
        <Route path="/login" element={<Auth />} />

        {/* /reset-password → reset page */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* /home → protected — only after login */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* any unknown route → /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;