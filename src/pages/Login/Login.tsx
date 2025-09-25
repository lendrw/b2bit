import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../shared/services";
import { useAuthContext } from "../../shared/contexts";
import { AxiosError } from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import b2bitLogo from "../../assets/B2Bit Logo.png";
import { AlertCircleIcon } from "lucide-react";
import { PageLayout } from "../../shared/layouts/PageLayout";

export const Login: React.FC = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  return (
    <PageLayout className="bg-[#FAFAFA] ">
      <Card className="bg-[#FFFFFF] w-screen sm:w-[11cm]  h-[14cm] flex items-center justify-center p-6 rounded-3xl shadow-[0_0_60px_0_rgba(200,200,200,1)] border-0">
        <img src={b2bitLogo} alt="B2Bit Logo" className="w-75" />
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
            <Form className="w-full h-74 flex flex-col justify-between ">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-base text-[#262626]">
                  E-mail
                </Label>
                <Field
                  as={Input}
                  type="email"
                  name="email"
                  placeholder="Email"
                  autoComplete="email"
                  className="bg-[#F1F1F1] text-[#B4B4B4] border-0 h-[1.4cm] rounded-lg"
                />
                <ErrorMessage
                  name="email"
                  component={({ children }: { children?: React.ReactNode }) => (
                    <Alert variant="destructive" className="p-0 border-0 ">
                      <AlertCircleIcon className="h-4 w-4" />
                      <AlertDescription>{children}</AlertDescription>
                    </Alert>
                  )}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-base text-[#262626]">
                  Password
                </Label>
                <Field
                  as={Input}
                  type="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  className="bg-[#F1F1F1] text-[#B4B4B4] border-0 h-[1.4cm] rounded-lg"
                />
                <ErrorMessage
                  name="password"
                  component={({ children }: { children?: React.ReactNode }) => (
                    <Alert variant="destructive" className="p-0 border-0 ">
                      <AlertCircleIcon className="h-4 w-4" />
                      <AlertDescription>{children}</AlertDescription>
                    </Alert>
                  )}
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#02274F] hover:bg-[#02274fe5] w-full h-[1.4cm] text-base cursor-pointer"
              >
                {isSubmitting ? "Loading..." : "Sign In"}
              </Button>
            </Form>
          )}
        </Formik>
        {error && (
          <Alert variant="destructive" className="p-2">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Login failed.</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </Card>
    </PageLayout>
  );
};
