import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import FormField from "../components/FormField";

import "../styles/color.css";
import "../styles/layout.css";
import "../styles/typography.css";
import "../styles/animation.css";

const Setting = () => {
  async function handleSave({ lunchStart, duration }, actions) {
    console.log(lunchStart, duration);
    // validate fields
  }

  const navigateHome = async () => {
    await handleSave();
  };

  return (
    <div className="dash-container fade-in">
      <div className="title-container">
        <div className="header3">Setting</div>
      </div>
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
