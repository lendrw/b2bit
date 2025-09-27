import React, { JSX } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  BrowserRouter,
  MemoryRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { AuthContext } from "@/shared/contexts/AuthContext/AuthContext";
import { authService } from "@/shared/services";
import { Login } from "./Login";
import { UserProfile } from "../UserProfile/UserProfile";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return { ...original, useNavigate: () => mockNavigate };
});

jest.mock("../../shared/services", () => ({
  authService: { login: jest.fn() },
}));

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const renderWithAuthContext = (
  overrides: Partial<React.ContextType<typeof AuthContext>> = {}
) => {
  const defaultValue = {
    login: jest.fn(),
    logout: jest.fn(),
    user: null,
    isAuthenticated: false,
    isLoading: false,
    setUser: jest.fn(),
  };

  return render(
    <BrowserRouter>
      <AuthContext.Provider value={{ ...defaultValue, ...overrides }}>
        <Login />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

const fillLoginForm = async (email: string, password: string) => {
  await userEvent.type(screen.getByPlaceholderText("Email"), email);
  await userEvent.type(screen.getByPlaceholderText("Password"), password);
  await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
};

describe("Login component", () => {
  describe("unit tests", () => {
    it("shows required errors when submitting empty form", async () => {
      renderWithAuthContext();
      await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getAllByText("Required").length).toBeGreaterThan(0);
      });
    });

    it("calls login on valid submission", async () => {
      const mockLogin = jest.fn();
      (authService.login as jest.Mock).mockResolvedValue({
        tokens: { access: "abc" },
      });

      renderWithAuthContext({ login: mockLogin });
      await fillLoginForm("test@test.com", "123456");

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({ accessToken: "abc" });
      });
    });

    it("shows error when email format is invalid", async () => {
      renderWithAuthContext();
      await fillLoginForm("abc", "123456");

      await waitFor(() => {
        expect(screen.getByText(/Invalid e-mail address/i)).toBeInTheDocument();
      });
    });
  });

  describe("integration tests", () => {
    it("renders email, password fields and button", () => {
      renderWithAuthContext();
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign in/i })
      ).toBeInTheDocument();
    });

    it("displays error alert on failed login and clears on input change", async () => {
      (authService.login as jest.Mock).mockRejectedValue(new Error("Invalid"));
      renderWithAuthContext();

      await fillLoginForm("fail@test.com", "wrong");

      await waitFor(() => {
        expect(screen.getByText(/login failed/i)).toBeInTheDocument();
      });

      await userEvent.clear(screen.getByPlaceholderText("Email"));
      await userEvent.type(
        screen.getByPlaceholderText("Email"),
        "fixed@test.com"
      );

      expect(screen.queryByText(/login failed/i)).not.toBeInTheDocument();
    });

    it("redirects to /profile on successful login", async () => {
      const mockLogin = jest.fn();
      (authService.login as jest.Mock).mockResolvedValue({
        tokens: { access: "abc" },
      });

      renderWithAuthContext({ login: mockLogin });
      await fillLoginForm("test@test.com", "123456");

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/profile");
      });
    });
  });

  describe("routing behavior", () => {
    it("redirects unauthenticated user from /profile to /login", () => {
      render(
        <MemoryRouter initialEntries={["/profile"]}>
          <AuthContext.Provider
            value={{
              login: jest.fn(),
              logout: jest.fn(),
              user: null,
              isAuthenticated: false,
              isLoading: false,
              setUser: jest.fn(),
            }}
          >
            <Routes>
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <UserProfile />
                  </PrivateRoute>
                }
              />
              <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
          </AuthContext.Provider>
        </MemoryRouter>
      );

      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });
});
