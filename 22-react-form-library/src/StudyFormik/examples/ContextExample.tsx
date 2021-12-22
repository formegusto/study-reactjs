import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

function ContextExample() {
  return (
    <Formik
      initialValues={{
        email: "",
        firstName: "",
        lastName: "",
        message: "",
        colors: "RED",
      }}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, "\t"));
      }}
      validationSchema={Yup.object({
        firstName: Yup.string()
          .max(15, "Must be 15 characters or less")
          .required("Required"),
        lastName: Yup.string()
          .max(20, "Must be 20 characters or less")
          .required("Required"),
        email: Yup.string().email("Invalid email address").required("Required"),
      })}
    >
      {() => (
        <Form>
          <label htmlFor="firstName">First Name</label>
          <Field name="firstName" type="text" />
          <ErrorMessage name="firstName" />

          <label htmlFor="lastName">Last Name</label>
          <Field name="lastName" type="text" />
          <ErrorMessage name="lastName" />

          <label htmlFor="email">Email</label>
          <Field name="email" type="email" />
          <ErrorMessage name="email" />

          <label htmlFor="message">Write U'r Message :)</label>
          <Field name="message" as="textarea" />

          <label htmlFor="colors">What's U'r Color ?</label>
          <Field name="colors" as="select">
            <option value="RED">red</option>
            <option value="GREEN">green</option>
            <option value="BLUE">blue</option>
          </Field>

          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
}

export default ContextExample;
