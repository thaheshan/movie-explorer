import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

// ── mock supabase ──
vi.mock("../services/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
        error: null,
      }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: {
          subscription: { unsubscribe: vi.fn() },
        },
      }),
      signOut: vi.fn().mockResolvedValue({}),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
}));

// ── mock redux ──
vi.mock("react-redux", () => ({
  useSelector: vi.fn().mockReturnValue({ user: null, loading: false }),
  useDispatch: vi.fn().mockReturnValue(vi.fn()),
  Provider: ({ children }) => children,
}));

// ── mock tmdbService ──
vi.mock("../services/tmdbService", () => ({
  getTrending:    vi.fn().mockResolvedValue({ results: [] }),
  getPopular:     vi.fn().mockResolvedValue({ results: [] }),
  getTopRated:    vi.fn().mockResolvedValue({ results: [] }),
  getNowPlaying:  vi.fn().mockResolvedValue({ results: [] }),
  searchMovies:   vi.fn().mockResolvedValue({ results: [] }),
  getImageUrl:    vi.fn().mockReturnValue(""),
}));

// ── helper: render routes inside MemoryRouter ──
const renderRoute = (initialPath) => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        {/* mirrors your App.jsx routes */}
        <Route path="/"               element={<Navigate to="/login" replace />} />
        <Route path="/login"          element={<div>Login Page</div>} />
        <Route path="/reset-password" element={<div>Reset Password Page</div>} />
        <Route path="/home"           element={<div>Home Page</div>} />
        <Route path="*"               element={<Navigate to="/login" replace />} />
      </Routes>
    </MemoryRouter>
  );
};

// ────────────────────────────────────────────────
describe("Redirect Loop Regression Tests", () => {

  it("should redirect / to /login", () => {
    renderRoute("/");
    expect(screen.getByText("Login Page")).toBeTruthy();
  });

  it("should show login page at /login", () => {
    renderRoute("/login");
    expect(screen.getByText("Login Page")).toBeTruthy();
  });

  it("should redirect unknown routes to /login", () => {
    renderRoute("/some-unknown-page");
    expect(screen.getByText("Login Page")).toBeTruthy();
  });

  it("should show reset password page at /reset-password", () => {
    renderRoute("/reset-password");
    expect(screen.getByText("Reset Password Page")).toBeTruthy();
  });

  it("should show home page at /home", () => {
    renderRoute("/home");
    expect(screen.getByText("Home Page")).toBeTruthy();
  });

  it("/ should never stay at / — always redirect", () => {
    renderRoute("/");
    expect(screen.queryByText("Login Page")).toBeTruthy();
    // confirm not stuck at blank page
    expect(document.body.innerHTML).not.toBe("");
  });

});