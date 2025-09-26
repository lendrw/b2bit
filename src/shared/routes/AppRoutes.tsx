import { Routes, Route, Navigate } from "react-router-dom";
import { Login, UserProfile } from "../../pages";
import { type JSX } from "react";
import { useAuthContext } from "../contexts";
import { PageLayout } from "../layouts/PageLayout";
import { Spinner } from "../utils/Spinner";

interface PrivateRouteProps {
  children: JSX.Element;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <PageLayout>
        <Spinner />
      </PageLayout>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
