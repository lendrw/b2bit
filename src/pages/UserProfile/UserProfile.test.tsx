import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "@/shared/routes/AppRoutes";
import { AuthContext } from "@/shared/contexts/AuthContext/AuthContext";
import {
  IAuthContextData,
  UserProfile as UserProfileType,
} from "@/shared/types/auth";
import { UserProfile } from "./UserProfile";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return { ...original, useNavigate: () => mockNavigate };
});

const renderWithAuthContext = (value: Partial<IAuthContextData>) =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={value as IAuthContextData}>
        <UserProfile />
      </AuthContext.Provider>
    </MemoryRouter>
  );

const renderWithAuthRoutes = (value: Partial<IAuthContextData>) =>
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <AuthContext.Provider value={value as IAuthContextData}>
        <AppRoutes />
      </AuthContext.Provider>
    </MemoryRouter>
  );

const mockUserFactory = (
  overrides?: Partial<UserProfileType>
): UserProfileType => ({
  id: "1",
  name: "User",
  last_name: "Test",
  email: "user@test.com",
  avatar: { id: 1, high: "", medium: "", low: "avatar.jpg" },
  role: { value: 1, label: "Admin" },
  last_login: "2025-09-27T12:00:00Z",
  staff_role: { value: 2, label: "Manager" },
  ...overrides,
});

const findSpinner = () => screen.queryByRole("status");

describe("UserProfile component", () => {
  describe("loading state", () => {
    it("renders spinner when loading", () => {
      renderWithAuthContext({ user: null, logout: jest.fn(), isLoading: true });
      expect(findSpinner()).toBeInTheDocument();
    });

    it("renders spinner when user is null", () => {
      renderWithAuthContext({
        user: null,
        logout: jest.fn(),
        isLoading: false,
      });
      expect(findSpinner()).toBeInTheDocument();
    });
  });

  describe("when user is present", () => {
    it("renders user information", () => {
      renderWithAuthContext({
        user: mockUserFactory(),
        logout: jest.fn(),
        isLoading: false,
      });

      expect(screen.getByText("Profile picture")).toBeInTheDocument();
      expect(screen.getByAltText("Profile")).toHaveAttribute(
        "src",
        "avatar.jpg"
      );
      expect(screen.getByDisplayValue("User")).toBeInTheDocument();
      expect(screen.getByDisplayValue("user@test.com")).toBeInTheDocument();
    });

    it("calls logout when clicking button", async () => {
      const mockLogout = jest.fn();
      renderWithAuthContext({
        user: mockUserFactory(),
        logout: mockLogout,
        isLoading: false,
      });

      await userEvent.click(screen.getByRole("button", { name: /logout/i }));
      await waitFor(() => expect(mockLogout).toHaveBeenCalled());
    });

    it("redirects to /login after successful logout", async () => {
      const mockSetUser = jest.fn();
      const mockLogout = jest.fn(() => {
        mockSetUser(null);
        mockNavigate("/login");
      });

      renderWithAuthContext({
        user: mockUserFactory(),
        logout: mockLogout,
        setUser: mockSetUser,
        isLoading: false,
      });

      await userEvent.click(screen.getByRole("button", { name: /logout/i }));

      await waitFor(() => expect(mockLogout).toHaveBeenCalled());
      await waitFor(() => expect(mockSetUser).toHaveBeenCalledWith(null));
      await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"));
    });
  });

  describe("routing behavior", () => {
    it("redirects authenticated user away from /login to /profile", () => {
      renderWithAuthRoutes({
        user: mockUserFactory(),
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: jest.fn(),
        setUser: jest.fn(),
      });

      expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Profile picture/i)).toBeInTheDocument();
    });
  });
});
