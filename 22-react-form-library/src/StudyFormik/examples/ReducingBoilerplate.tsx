import { ErrorMessage, Field, Form, Formik } from "formik";

function ReducingBoilerplate() {
  return (
    <div>
      <h1>Any place in your app!</h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        validate={(values) => {
          // error object controll
          const errors: {
            [key: string]: any;
          } = {};
          if (!values.email) errors.email = "Required";
          else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          // submit request
          setTimeout(() => {
            console.group();
            console.log("submit! :)");
            console.log(values);
            console.groupEnd();

            // submiting value controll
            setSubmitting(false);
          }, 2000);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" />
            <Field type="password" name="password" />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ReducingBoilerplate;
