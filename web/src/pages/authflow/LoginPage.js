import { useContext } from "react";
import { Formik, Form } from "formik";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../../context";
import FormField from "../../components/FormField";
import queryString from "query-string";

import "../../styles/color.css";
import "../../styles/layout.css";
import "../../styles/typography.css";

function LoginPage(props) {
  const auth = useContext(AuthContext);
  // query string
  const parsedQuery = queryString.parse(props.location.search);
  console.log(parsedQuery.redirect);

  if (auth.isAuthenticated) {
    return <Redirect to="/" />;
  }

  async function handleSubmit({ email, password }, actions) {
    try {
      await auth.login(email, password);
    } catch (error) {
      const message =
        error.response.status === 400
          ? error.response.data.message
          : "An unknown error occurred.";
      actions.setFieldError("email", message);
      actions.setFieldError("password", message);
    }
  }

  return (
    <div className="login-container outlineCardContainer">
      <div className="title-container">
        <div className="header3">Login here</div>
      </div>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
      >
        {({ errors, isSubmitting }) => (
          <Form>
            <FormField
              name="email"
              type="email"
              label="Email"
              errors={errors}
              className="bodyText"
            />
            <FormField
              name="password"
              type="password"
              label="Password"
              errors={errors}
            />
            <button
              type="submit"
              className="fullstretchButton primary-button"
              disabled={isSubmitting}
            >
              Log in
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default LoginPage;
