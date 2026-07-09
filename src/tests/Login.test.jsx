// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { createContext, useContext } from "react";

// Create a mock AuthContext that wraps the component
const MockAuthContext = createContext(null);

vi.mock("../context/AuthContext", () => ({
  useAuth: () => useContext(MockAuthContext),
  AuthProvider: ({ children }) => children,
}));

// Mock auth context value
const mockAuthValue = {
  login: vi.fn().mockResolvedValue({ success: true }),
  user: null,
  loading: false,
  notifications: [],
  unreadCount: 0,
};

// Wrapper component providing mock context
const MockProvider = ({ children }) => (
  <MockAuthContext.Provider value={mockAuthValue}>
    <MemoryRouter>
      <Toaster />
      {children}
    </MemoryRouter>
  </MockAuthContext.Provider>
);

describe("Login Page", () => {
  let Login;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Dynamic import after mocks are set up
    const mod = await import("../pages/Login");
    Login = mod.default;
  });

  const renderLogin = () => render(<MockProvider><Login /></MockProvider>);

  it("renders the login form", () => {
    renderLogin();
    const form = document.querySelector("form");
    expect(form).toBeTruthy();
  });

  it("renders EduLearn branding text", () => {
    renderLogin();
    expect(document.body.textContent).toMatch(/EduLearn/i);
  });

  it("renders a password input", () => {
    renderLogin();
    const pwdInput = document.querySelector("input[type='password']");
    expect(pwdInput).toBeTruthy();
  });

  it("renders a submit button", () => {
    renderLogin();
    const btn = document.querySelector("button[type='submit']");
    expect(btn).toBeTruthy();
  });
});
