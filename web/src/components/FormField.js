import { Field, ErrorMessage } from "formik";
import clsx from "clsx";

/** A `<Field />` from Formik with error messages & basic styling. */
function FormField({ name, type, label, errors, width }) {
  return (
    <div className="field">
      <label style={{ marginBottom: "6px" }} className="body">
        {label}
      </label>
      <div className="control">
        <div style={width ? { width: width } : null}>
          <Field
            name={name}
            type={type || "text"}
            className={clsx("input", errors[name] && "is-danger")}
          />
        </div>
      </div>
      <p className="help is-danger">
        <ErrorMessage name={name} />
      </p>
    </div>
  );
}

export default FormField;
