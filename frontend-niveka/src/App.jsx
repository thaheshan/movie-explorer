import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth             from "./pages/AuthPage";
import ResetPassword    from "./components/ui/ResetPassword";
import HomePage         from "./pages/HomePage";
import FavouritesPage   from "./pages/FavouritesPage";
import MovieDetailPage  from "./pages/MovieDetailPage";
import ProtectedRoute   from "./components/ui/ProtectedRoute";
import ProfilePage    from "./pages/ProfilePage";

function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<Navigate to="/login" replace />} />
        <Route path="/login"          element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home"
          element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/favourites"
          element={<ProtectedRoute><FavouritesPage /></ProtectedRoute>} />
        <Route path="/movie/:id"
          element={<ProtectedRoute><MovieDetailPage /></ProtectedRoute>} />
        <Route path="/profile"
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;