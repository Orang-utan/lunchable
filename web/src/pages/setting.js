import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import FormField from "../components/FormField";
import { useHistory } from "react-router-dom";

import "../styles/color.css";
import "../styles/layout.css";
import "../styles/typography.css";
import "../styles/animation.css";

const Setting = () => {
  const history = useHistory();

  async function handleSave({ lunchStart, duration }, actions) {
    // API call to save
    console.log(lunchStart, duration);
  }

  return (
    <div className="dash-container fade-in">
      <div
        onClick={() => history.push("/dashboard")}
        className="pointer body"
        style={{ opacity: "0.5" }}
      >
        ← Home
      </div>
      <br />
      <Formik initialValues={{ email: "", password: "" }} onSubmit={handleSave}>
        {({ errors, isSubmitting }) => (
          <Form>
            <FormField
              type="time"
              name="lunchStart"
              label="Usual lunch time"
              errors={errors}
              className="bodyText"
              width={300}
            />
            <FormField
              name="duration"
              label="Duration"
              errors={errors}
              type="number"
              width={300}
            />
            <button
              type="submit"
              className="fullstretchButton primary-button"
              style={{ width: "90px" }}
              disabled={isSubmitting}
            >
              Save
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Setting;
