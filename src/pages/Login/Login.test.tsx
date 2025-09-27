import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Login } from "./Login";
import {
  BrowserRouter,
  MemoryRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { AuthContext } from "@/shared/contexts/AuthContext/AuthContext";
import { authService } from "../../shared/services";
import React, { JSX } from "react";
import { UserProfile } from "../UserProfile/UserProfile";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

jest.mock("../../shared/services", () => ({
  authService: {
    login: jest.fn(),
  },
}));

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const renderWithContext = (isLoading = false, login = jest.fn()) => {
  render(
    <BrowserRouter>
      <AuthContext.Provider
        value={{
          login,
          logout: jest.fn(),
          user: null,
          isAuthenticated: false,
          isLoading,
          setUser: jest.fn(),
        }}
      >
        <Login />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe("Login component - unit", () => {
  test("shows required errors when submitting empty form", async () => {
    renderWithContext();
    const button = screen.getByRole("button", { name: /sign in/i });
    await userEvent.click(button);

    await waitFor(() => {
      const errors = screen.getAllByText("Required");
      errors.forEach((error) => {
        expect(error).toBeInTheDocument();
      });
    });
  });

  test("calls login on valid submission", async () => {
    const mockLogin = jest.fn();
    (authService.login as jest.Mock).mockResolvedValue({
      tokens: { access: "abc" },
    });
    renderWithContext(false, mockLogin);

    await userEvent.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await userEvent.type(screen.getByPlaceholderText("Password"), "123456");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ accessToken: "abc" });
    });
  });
});

describe("Login component - component", () => {
  test("renders email, password fields and button", () => {
    renderWithContext();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  test("displays error alert on failed login and clears on input change", async () => {
    (authService.login as jest.Mock).mockRejectedValue(new Error("Invalid"));
    renderWithContext();

    await userEvent.type(screen.getByPlaceholderText("Email"), "fail@test.com");
    await userEvent.type(screen.getByPlaceholderText("Password"), "wrong");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    });

    await userEvent.clear(screen.getByPlaceholderText("Email"));
    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      "fail2@test.com"
    );

    expect(screen.queryByText(/login failed/i)).not.toBeInTheDocument();
  });

  test("redirects to /profile on successful login", async () => {
    const mockLogin = jest.fn();
    (authService.login as jest.Mock).mockResolvedValue({
      tokens: { access: "abc" },
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            login: mockLogin,
            logout: jest.fn(),
            user: null,
            isAuthenticated: false,
            isLoading: false,
            setUser: jest.fn(),
          }}
        >
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    await userEvent.type(screen.getByPlaceholderText("Email"), "test@test.com");
    await userEvent.type(screen.getByPlaceholderText("Password"), "123456");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/profile");
    });
  });

  test("If the user tries to manually access /profile, they are redirected to /login if not authenticated.", () => {
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
