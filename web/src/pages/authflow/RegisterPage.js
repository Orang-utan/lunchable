import { useContext } from "react";
import { Formik, Form } from "formik";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../../context";
import api from "../../api";
import FormField from "../../components/FormField";

import "../../styles/color.css";
import "../../styles/layout.css";
import "../../styles/typography.css";

function RegisterPage() {
  const auth = useContext(AuthContext);

  if (auth.isAuthenticated) {
    return <Redirect to="/" />;
  }

  async function handleSubmit(values, actions) {
    try {
      await api.post("/api/users/signup", values);
      await auth.login(values.email, values.password);
    } catch (error) {
      const { message, code } =
        error.response.status === 400
          ? error.response.data
          : { message: "An unknown error occurred.", code: null };
      let fields;
      console.log(error.response.data);
      console.log(code);
      if (code === "already-exists") {
        fields = ["email"];
      } else {
        fields = ["firstName", "lastName", "email", "password", "invitation"];
      }
      for (const field of fields) {
        actions.setFieldError(field, message);
      }
    }
  }

  return (
    <div className="login-container outlineCardContainer">
      <div className="title-container">
        <div className="header3">Create an account</div>
      </div>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          invitation: "",
        }}
        onSubmit={handleSubmit}
      >
        {({ errors, isSubmitting }) => (
          <Form>
            <FormField name="firstName" label="First Name" errors={errors} />
            <FormField name="lastName" label="Last Name" errors={errors} />
            <FormField
              name="email"
              type="email"
              label="Email"
              errors={errors}
            />
            <FormField
              name="password"
              type="password"
              label="Password"
              errors={errors}
            />
            <FormField
              name="invitation"
              type="invitation"
              label="Invitation Code"
              placeholder="Contact us for invitation code!"
              errors={errors}
            />
            <button
              type="submit"
              className="fullstretchButton primary-button"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default RegisterPage;
