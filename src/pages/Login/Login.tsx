import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../shared/services";
import { useAuthContext } from "../../shared/contexts";
import { AxiosError } from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";

export const Login: React.FC = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <Formik
        initialValues={{ email: "", password: "" }}
        validate={(values) => {
          const errors: Partial<typeof values> = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          if (!values.password) {
            errors.password = "Required";
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            const response = await authService.login(values);
            login({ accessToken: response.tokens.access });
            navigate("/profile");
          } catch (err: unknown) {
            if (err instanceof AxiosError && err.response?.status === 400) {
              const data = err.response.data as Record<string, string[]>;
              const formErrors: Record<string, string> = {};
              Object.keys(data).forEach((field) => {
                formErrors[field] = data[field][0];
              });
              setErrors(formErrors);
            } else {
              setError("Wrong e-mail or password, please try again.");
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <Field type="email" name="email" placeholder="Email" />
              <ErrorMessage name="email" component="div" />
            </div>
            <div>
              <Field type="password" name="password" placeholder="Password" />
              <ErrorMessage name="password" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Loading..." : "Login"}
            </button>
          </Form>
        )}
      </Formik>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};
