import { Formik } from "formik";

function TheGist() {
  return (
    <div>
      <h1>Anywhere in your app!</h1>
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
        {({
          // initial values 값
          values,
          // return validate errors object
          errors,
          touched,

          // submit handle
          handleSubmit,

          // input change
          handleChange,

          // input blur
          handleBlur,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            {errors.email && touched.email && errors.email}
            <input
              type="password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            {errors.password && touched.password && errors.password}
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default TheGist;
