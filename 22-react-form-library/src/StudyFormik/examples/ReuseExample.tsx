import { FieldConfig, Form, Formik, useField } from "formik";
import React from "react";
import styled, { keyframes } from "styled-components";
import * as Yup from "yup";

type ConfigProps = {
  label?: string;
  id: string;
};

interface FieldProps extends FieldConfig<any>, ConfigProps {}

function MyInput({ label, id, ...fieldProps }: FieldProps) {
  const [field, meta] = useField(fieldProps);

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        className={`text-input ${
          meta.touched ? (meta.error ? "error" : "") : ""
        }`}
        id={id}
        {...field}
      />
      {meta.touched && meta.error ? (
        <div className="error-message">{meta.error}</div>
      ) : (
        <></>
      )}
    </>
  );
}

function MyCheckBox({ children, ...fieldProps }: FieldConfig) {
  const [field, meta] = useField({ ...fieldProps, type: "checkbox" });

  return (
    <div>
      <label className={`checkbox-input`}>
        <input type="checkbox" {...field} />
        {children}
      </label>
      {meta.touched && meta.error ? (
        <div className="error-message">{meta.error}</div>
      ) : (
        <></>
      )}
    </div>
  );
}

function MySelect({ label, id, children, ...fieldProps }: FieldProps) {
  const [field, meta] = useField(fieldProps);

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <select {...field}>{children}</select>
      {meta.touched && meta.error ? (
        <div className="error-message">{meta.error}</div>
      ) : (
        <></>
      )}
    </>
  );
}

// type InitialValue = {
//   firstName?: string;
//   lastName?: string;
//   email?: string;
//   acceptedTerms?: boolean;
//   jobType?: string;
// };

function ReuseExample() {
  const [values, setValues] = React.useState(
    JSON.parse(sessionStorage.getItem("sign-up-info-bak") || "null") || {
      firstName: "",
      lastName: "",
      email: "",
      acceptedTerms: false,
      jobType: "",
    }
  );

  React.useEffect(() => {
    console.log(values);
  }, [values]);

  return (
    <Wrap>
      <h1>Subscribe!</h1>
      {values && (
        <Formik
          initialValues={values}
          validationSchema={Yup.object({
            firstName: Yup.string()
              .max(15, "Must be 15 characters or less")
              .required("Required"),
            lastName: Yup.string()
              .max(20, "Must be 20 characters or less")
              .required("Required"),
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            acceptedTerms: Yup.boolean()
              .required("Required")
              .oneOf([true], "You must accept the terms and conditions."),
            jobType: Yup.string()
              .oneOf(
                ["designer", "development", "product", "other"],
                "Invalid Job Type"
              )
              .required("Required"),
          })}
          validate={(values) => {
            sessionStorage.setItem("sign-up-info-bak", JSON.stringify(values));
          }}
          onSubmit={(values) => {
            alert(JSON.stringify(values, null, "\t"));
          }}
        >
          {({ isSubmitting, handleReset }) => (
            <Form>
              <MyInput
                label="First Name"
                id="firstName"
                name="firstName"
                type="text"
              />
              <MyInput
                label="Last Name"
                id="lastName"
                name="lastName"
                type="text"
              />
              <MyInput label="Email" id="email" name="email" type="email" />

              <MySelect label="Job Type" id="jobType" name="jobType">
                <option value="">Select a job type</option>
                <option value="designer">Designer</option>
                <option value="development">Developer</option>
                <option value="product">Product Manager</option>
                <option value="other">Other</option>
              </MySelect>

              <MyCheckBox name="acceptedTerms">Accepted Terms</MyCheckBox>

              <button type="button" onClick={handleReset}>
                button has handleReset func
              </button>
              <button
                type="reset"
                onClick={() => {
                  setValues({
                    firstName: "",
                    lastName: "",
                    email: "",
                    acceptedTerms: false,
                    jobType: "",
                  });
                }}
              >
                real reset
              </button>
              <button type="submit" disabled={isSubmitting}>
                Submit :)
              </button>
            </Form>
          )}
        </Formik>
      )}
    </Wrap>
  );
}

const Shake = keyframes`
    0% {
        transform: translateX(0);
    } 25% {
        transform: translateX(-2px);
    } 50% {
        transform: translateX(2px);
    } 100% {
        transform: translateX(0);
    }
`;
const Wrap = styled.div`
  & input.error {
    border-color: #f00;
    animation: ${Shake} 0.15s linear 3;
  }
`;

export default ReuseExample;
