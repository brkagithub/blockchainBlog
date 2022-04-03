import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Box, Card } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-mui";
import isEmail from "validator/lib/isEmail";

import {
  LayoutItemLoading,
  LayoutItemSafeCenter,
} from "@/components/UI/Layout";

import { MetamaskIcon, WalletConnect } from "@/helpers/icons";

type LoginForm = {
  username: string;
  password: string;

  email: string;
  confirm_password: string;
};

const Login: NextPage = () => {
  const router = useRouter();
  const isLogin = router.asPath === "/login";
  const [formError, setFormError] = useState("");

  const { isAuthenticated, authenticate, isAuthenticating, login, signup } =
    useMoralis();

  useEffect(() => {
    if (isAuthenticated)
      router.replace("/").then(() => console.log("Logged in, redirecting..."));
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps
  if (isAuthenticated) return <LayoutItemLoading />;

  const loading = isAuthenticating;
  const error = formError;

  return (
    <LayoutItemSafeCenter xl={5}>
      <Card>
        <h1>{isLogin ? "Login" : "Register"}</h1>
        {error && (
          <Box color="error.main" fontWeight="bold">
            <p>
              {"Error: "}
              {error}
            </p>
          </Box>
        )}
        <Formik<LoginForm>
          initialValues={{
            email: "",
            confirm_password: "",
            username: "",
            password: "",
          }}
          validate={(values) => {
            let errs: Partial<LoginForm> = {};

            if (!isEmail(values.email) && !isLogin)
              errs.email = "Invalid e-mail.";
            if (values.username.length < 3)
              errs.username = "Must be at least 3 characters.";
            if (values.password !== values.confirm_password && !isLogin)
              errs.confirm_password = "Passwords must match.";

            return errs;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setFormError("");
              await (isLogin
                ? login(values.username, values.password, {
                    throwOnError: true,
                    usePost: true,
                  })
                : signup(
                    values.username,
                    values.password,
                    values.email,
                    {},
                    {
                      throwOnError: true,
                    }
                  ));
            } catch (e: any) {
              setFormError(e.message || e || "Unknown error occurred.");
              // setTimeout(() => setFormError(""), 5000);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ submitForm, isSubmitting, isValid, dirty }) => (
            <>
              <Form>
                <input type="submit" hidden />
                <Field
                  component={TextField}
                  name="username"
                  id="username"
                  label="Username"
                  margin="dense"
                  fullWidth
                />
                <Field
                  component={TextField}
                  name="password"
                  id="password"
                  type="password"
                  label="Password"
                  margin="dense"
                  fullWidth
                />
                {!isLogin && (
                  <Field
                    component={TextField}
                    name="confirm_password"
                    id="confirm_password"
                    type="password"
                    label="Confirm Password"
                    margin="dense"
                    fullWidth
                  />
                )}
                {!isLogin && (
                  <Field
                    component={TextField}
                    name="email"
                    id="email"
                    type="email"
                    label="Email"
                    margin="dense"
                    fullWidth
                  />
                )}
              </Form>
              <Box
                sx={{
                  "& > button": { m: 1 },
                  marginLeft: -1,
                }}
              >
                <LoadingButton
                  loading={loading || isSubmitting}
                  variant="contained"
                  onClick={submitForm}
                  disabled={!isValid || !dirty}
                >
                  {isLogin ? "Login" : "Register"}
                </LoadingButton>
                <LoadingButton
                  loading={loading || isSubmitting}
                  startIcon={<MetamaskIcon />}
                  variant="outlined"
                  onClick={() => authenticate({ provider: "metamask" })}
                >
                  Metamask
                </LoadingButton>
                <LoadingButton
                  loading={loading || isSubmitting}
                  startIcon={<WalletConnect />}
                  variant="outlined"
                  onClick={() => authenticate({ provider: "walletConnect" })}
                >
                  Wallet Connect
                </LoadingButton>
                <LoadingButton
                  loading={loading || isSubmitting}
                  onClick={() =>
                    router.replace(isLogin ? "/register" : "/login")
                  }
                >
                  {!isLogin ? "Login" : "Register"}
                </LoadingButton>
              </Box>
            </>
          )}
        </Formik>
      </Card>
    </LayoutItemSafeCenter>
  );
};
export default Login;
