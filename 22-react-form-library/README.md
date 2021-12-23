# 22.react-form-libray

# 1. formik

[Overview | Formik](https://formik.org/docs/overview)

## 1. Overview

- React에서의 Form이라는 것은 많은 렌더링을 통해 상당한 비용을 Application에 준다.
- 이것외에도 많은 비용을 발생하게 하는 요소들이 있는데, Formik은 가장 성가신 3가지 부분을 도와주는 라이브러리이다.
  1. **Getting values in and aout of form state : 폼의 상태 구성**
  2. **Validation and error messages : 유효성 검사 및 오류 메시지**
  3. **Handling form submission : submit 처리**
- formik은 redux-form과 비교하여, form의 상태는 본질적이고 일시적이고 지역적이므로 redux에서 추적할 필요가 없음을 설명하고, redux-form 라이브러리 사이즈(22.5kb, formik is 12.7kb)와 redux 감속기를 여러번 호출하는 점에서 본인들의 라이브러리의 우세를 설명한다.

```
npm install formik --save

yarn add formik

<script src="https://unpkg.com/formik/dist/formik.umd.production.min.js"></script>
```

## 2. Getting Started

### 1. Basic

```tsx
<Formik
  initialValues={{ email: "", password: "" }}
  validate={(values) => {
    // error object controll
    const errors: {
      [key: string]: any;
    } = {};
    if (!values.email) errors.email = "Required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
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
```

- formik의 사용법은 위와 같이 Formik Component 자식들에게 Formik Component가 내려주는 Component 반환 함수의 매개변수로 넣어주는 방식을 이용한다.
- 각 매개변수는 다음을 의미한다.
  1. values : initial value 설정값, 후에 변경되는 값
  2. errors : validate와 같은 검사하는 Formik의 Props가 내려주는 error 객체
  3. handleSubmit : Formik Props onSubmit Config Func Value
  4. handleChange : input 값을 변경하는 역할을 한다.
  5. handleBlur : Formik Props onBlur Config Func Value , onFocus
  6. isSubmitting : onSubmit에서 setSubmitting을 통해 submit 상태를 제어할 수 있다. 기본적으로 submit이 발생하면 true로 들어가게 되어있기 때문에 위와 같이 button에 disable로 걸어버리면 한번 밖에 동작을 안한다. 그래서 onSubmit에서 에러가 날 경우 다시 false값으로 만들어주는 등의 액션을 취해줘야 한다.

### 2. Reducing boilerplate

- Formik은 react에서 form을 더욱 쉽게 사용할 수 있도록 <Form />, <Field />, <ErrorMessage />와 같은 Component들도 제공해준다.

```tsx
<Formik
  initialValues={{ email: "", password: "" }}
  validate={(values) => {
    // error object controll
    const errors: {
      [key: string]: any;
    } = {};
    if (!values.email) errors.email = "Required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
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
```

- HOC의 역할을 하는 Formik Component가 내려주는 handleChange, handleSubmit, values, errors 들은 사용처가 명확하기 때문에 아래와 같이 formik 라이브러리가 제공해주는 컴포넌트들을 사용하면 더 깔끔한 코드를 작성할 수 있다.

### 3. Complementary Packages

> **라이브러리 yup에 대한 소개인데, 본인의 취향을 어필했다.**

## 3. Tutorial

### 1. Basics

> **A simple newsletter signup form**

```tsx
const formik = useFormik({
  initialValues: {
    email: "",
  },
  onSubmit: (values) => {
    alert(JSON.stringify(values, null, "\t"));
  },
});

return (
  <form onSubmit={formik.handleSubmit}>
    <label htmlFor="email">Email Address</label>
    <input
      id="email"
      name="email"
      type="email"
      value={formik.values.email}
      onChange={formik.handleChange}
    />
    <button type="submit">Submit</button>
  </form>
);
```

- 다음은 useFormik이라는 hook이 처음등장한 것을 볼 수 있다. 사용법 역시 간편하다.
- 공식 설명
  - `handleSubmit` : A submission handler
  - `handleChange` : A change handler to pass to each `<input>`, `<select>`, or `<textarea>`
  - `values` : Our form’s current values
- 이러한 사용법은 우리가 일반적인 React.useState를 사용하여 폼의 값들을 구성하고, 이들을 변화시키는 함수를 만드는 것과 동일하게 동작함을 알 수 있다.

### 2. Validation

```tsx
const validate = (values: SingupInfo) => {
  const errors: SingupInfo = {};

  if (!values.firstName) {
    errors.firstName = "Required";
  } else if (values.firstName.length > 15) {
    errors.firstName = "Must be 15 characters or less";
  }

  if (!values.lastName) {
    errors.email = "Required";
  } else if (values.lastName.length > 20) {
    errors.lastName = "Must be 20 characters or less";
  }

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  return errors;
};

function SignupForm() {
  const formik = useFormik<SingupInfo>({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
    validate,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, "\t"));
    },
  });
	// ...
```

- formik의 submit은 errors 객체를 이용해서 validating error을 알려준다. 해당 객체가 비어있는 객체가 아니라면, handleSubmit을 동작시키지 않는다.
- errors객체와 initialValues의 형식을 맞출것을 권장하고 있다. 격하게

### 3. visited field

- 위의 예제를 해보면 알겠지만, 사용자가 입력하는 순간부터 에러메시지가 표출된다. 이는 좋은 사용자 경험이 아니다.
- 그래서 이들은 사용자의 touch가 끝난 후에 이를 표출하도록 하는 예제를 준비해줬다. formik의 touched 필드의 프로퍼티는 해당 value의 name이 현재 입력되고 있는 상태인지를 나타낸다.

```tsx
{
  formik.touched.lastName && formik.errors.lastName ? (
    <div>{formik.errors.lastName}</div>
  ) : null;
}
```

- 이와 같이 touched를 통해 해당 필드의 입력이 끝났는지를 확인하고, error가 존재하는 지 확인까지 한 다음 에러메시지를 띄우는 예제를 보여줬다.

### 4. Schema Validation With Yup

```tsx
const formik = useFormik<SingupInfo>({
  initialValues: {
    email: "",
    firstName: "",
    lastName: "",
  },
  validationSchema: Yup.object({
    firstName: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("Required"),
    lastName: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
  }),
  onSubmit: (values) => {
    alert(JSON.stringify(values, null, "\t"));
  },
});
```

- formik 개발자분은 Yup Library를 사용하신다. 아무튼, 이와 같이 3rd party library로서, validation을 사용할거면 해당 오브젝트는 Schema의 형태이기 때문에, validationSchema로 등록해주면 된다.

### 5. getFieldProps()

- input에 공통적으로 들어가는 props들을 간소화 해주는 작업이다.

```tsx
<input
  id="firstName"
  name="firstName"
  type="text"
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  value={formik.values.firstName}
/>
```

- 해당 코드의 특징은 onChange, onBlur, value의 경우에는 formik이 관리하기 때문에, formik에서 충분히 제공해줄 수 있는 요소이다.

```tsx
<input id="firstName" type="text" {...formik.getFieldProps("firstName")} />
```

- `formik.getFieldProps` 를 이용한다. 추가적으로 어떤 필드의 props를 원하는지 까지 매개변수로 보내주면 name 마저 생략할 수 있다.

### 6. Leveraging React Context

- 위의 내용까지를 해도, Formik의 작업에 대해서 매우 명시적임을 느낄 수가 있다. Formik은 우리가 form 양식 개발에 더 많은 시간을 절약할 수 있도록 Context를 제공한다.
- 바로 이 역할을 하는 Component가 `<Formik />` Component 이다. 해당 Component는 어떠한 컴포넌트를 FormikContext의 child component를 바꿔주는 기능을 한다.

```tsx
<Formik
  initialValues={{
    email: "",
    firstName: "",
    lastName: "",
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
  {(props) => ({
    /* ... */
  })}
</Formik>
```

- 이 안에서는 `<Form />`, `<Field />`, `<ErrorMessage />` 와 같은 컴포넌트들을 활용하여 더욱 명시적이지 않은 코드를 짤 수가 있어진다.

> **`<Field />` Component**

- Field Component는 기본값으로 `<input />` 로 만들어지도록 설계가 되어있다. 하지만, as 옵션을 주면 textarea나 select 로도 생성이 가능하다.

```tsx
<label htmlFor="message">Write U'r Message :)</label>
<Field name="message" as="textarea" />

<label htmlFor="colors">What's U'r Color ?</label>
<Field name="colors" as="select">
  <option value="RED">red</option>
  <option value="GREEN">green</option>
  <option value="BLUE">blue</option>
</Field>
```

### 7. formik’s passion as react component

- formik은 계속해서 prop-drilling을 줄이기 위해 노력하고 있다. 우리의 코드의 잘못된 요소는 바로 label, Field, ErrorMessage 컴포넌트를 반복한다는 점이 있다.
- Formik은 유머러스하다. 어플리케이션에서 재사용 가능한 구성요소를 사용자 입맛에 맞게 잘 구축하도록, Field 컴포넌트에게는 여동생이 있으며, 그녀의 이름은 `useField`라고 한다.

> **General Custom Input**

```tsx
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
      <input className="text-input" id={id} {...field} />
      {meta.touched && meta.error ? (
        <div className="error-message">{meta.error}</div>
      ) : (
        <></>
      )}
    </>
  );
}
```

- useField를 쓰고, Field Component 인 것 마냥 props를 받으면, 본인이 그 역할을 할 수 있도록 해주는 field와 meta라는 변수를 부여받는다.
- field는 Field Component의 역할을 하게 될 input element에게 부여해주면 된다.
- meta는 그 밖에 해당 field가 현재 focusing 상태인지, error 상태인지를 알려준다.

> **CheckBox Example**

```tsx
function MyCheckBox({ children, ...fieldProps }: FieldConfig) {
  const [field, meta] = useField({ ...fieldProps, type: "checkbox" });

  return (
    <div>
      <label className="checkbox-input">
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

<MyCheckBox name="acceptedTerms">Accepted Terms</MyCheckBox>;
```

- useField는 그냥 Field Component 처럼 매개변수를 보내주면 된다. 그래서 checkbox도 이와같이 구성하면 된다.
- children을 활용하는 이유는 텍스트를 담기 위해서 이다.

> **Select Example**

```tsx
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

<MySelect label="Job Type" id="jobType" name="jobType">
  <option value="">Select a job type</option>
  <option value="designer">Designer</option>
  <option value="development">Developer</option>
  <option value="product">Product Manager</option>
  <option value="other">Other</option>
</MySelect>;
```

- 일반 input 다루듯이 useField를 사용하면 된다.
- children을 사용하는 이유는 option을 담기 위해서이다.

## 4. Formik Practicing

> **아주 친절하게도, 연습문제들도 던져줬다.**

### Disable the submit button while the user has attempted to submit

```tsx
<Formik>
{({ isSubmitting }) => (
	{/* ... */}
	<button type="submit" disabled={isSubmitting}>Submit! :)</button>
)}
</Formik>
```

- **이런식으로 isSubmitting을 받아주면 된다.**

### Add reset button with **`formik.handleReset`**

```tsx
{({ isSubmitting, handleReset }) => (
  <Form>
    <button type="button" onClick={handleReset}>
      button has handleReset func
    </button>
    <button type="reset">real reset</button>
  </Form>
)
```

- 일반 버튼에 handleReset을 붙이는 방식과, reset button을 사용하는 방식 모두 동일하게 동작한다.

### Pre-populate initalValues based on props passed to `<SignupForm>`

```tsx
function ReuseExample({
  firstName = "",
  lastName = "",
  email = "",
  acceptedTerms = false,
  jobType = "",
}: InitialValue) {
  return (
    <>
      <h1>Subscribe!</h1>
      <Formik
        initialValues={{
          firstName,
          lastName,
          email,
          acceptedTerms,
          jobType,
        }}

<ReuseExample firstName="노" lastName="태헌" jobType="development" />;
```

### Change the input border color to red when a field has an error and isn’t focused

```tsx
<input
  className={`text-input ${meta.touched && meta.error && "error"}`}
  id={id}
  {...field}
/>;

// 요런느낌으로 넣어주고,

const Wrap = styled.div`
  & input.error {
    border-color: #f00;
  }
`;
// 격파!
```

### Add a shake animation to each field when it displays an error and has been visited

```tsx
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

// 요로코롬 넣어주면 된다.
```

### Persist form state to the browser’s sessionStorage so that form progress is kept in between page refreshes

```tsx
const [values, setValues] = React.useState(
  JSON.parse(sessionStorage.getItem("sign-up-info-bak") || "null") || {
    firstName: "",
    lastName: "",
    email: "",
    acceptedTerms: false,
    jobType: "",
  }
);
```

- Formik에서 InitialValue 설정 시, reset하면 값이 비어지는것이 아니라, iniialValue로 들어가지는 현상이 있다. ( 나중에 수정! )

# 2. react-hook-form

- react hook form은 렌더링을 최대한 줄이는 방식을 채택했기로 유명하다.

## 1. Get Started

```tsx
type Inputs = {
  example: string;
  exampleRequired: string;
};

function Basic() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  console.log(watch("example")); // watch input value by passing the name of it

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}
      <input defaultValue="test" {...register("example")} />

      {/* include validation with required or other standard HTML validation rules */}
      <input {...register("exampleRequired", { required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}

      <input type="submit" />
    </form>
  );
}
```

- react-hook-form 라이브러리는 기본적으로 4개의 구성요소가 있다.
  1. register : input 필드 정보등록
  2. handleSubmit : submit 함수 등록
  3. watch : 변경되는 값들의 상태를 확인할 수 있다.
  4. errors : validation error에 걸리는 필드를 확인할 수 있다.

> **TypeScript Tip**

```tsx
type Inputs = {
  example: string;
  exampleRequired: string;
};

const {
  register,
  handleSubmit,
  watch,
  formState: { errors },
} = useForm<Inputs>();
const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
```

- 다음과 같이 inputs에 대한 type을 지정해주면, useForm와 onSubmit은 다음과 같은 탐색이 가능해진다.
  - useForm : 후에 register를 이용할 때, custom input type의 자동완성
  - onSubmit : 매개변수 data의 type 지정

## 2. Register fields

```tsx
interface IFormInput {
  firstName: string;
  gender: GenderEnum;
}

function RegisterField() {
  const { register, handleSubmit } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    alert(JSON.stringify(data, null, "\t"));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("firstName")} />
      <select {...register("gender")}>
        <option value="female">female</option>
        <option value="male">male</option>
        <option value="other">other</option>
      </select>
      <input type="submit" />
    </form>
  );
}
```

- React Hook Form의 핵심 개념 중 하나는 “register your uncontrolled component into the hook” 이라고 한다.

> Typescript로 작업하고 레지스터 유형을 정의하려는 경우 이렇게 정의할 수 있다.
>
> `register: UserFormRegister<FieldValue>`

## 3. Apply Validation

- react-hook-form에서 자체적으로 제공하는 validations
  - required
  - min
  - max
  - minLength
  - maxLength
  - pattern
  - validate

```tsx
interface IFormInput {
  firstName: string;
  lastName: string;
  age: number;
}

function ApplyValidation() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    alert(JSON.stringify(data, null, "\t"));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("firstName", { required: true, maxLength: 20 })} />
      {errors.firstName && <span>First Name Error</span>}

      <input {...register("lastName", { pattern: /^[A-Za-z]+$/i })} />
      {errors.lastName && <span>Last Name Error</span>}

      <input type="number" {...register("age", { min: 18, max: 99 })} />
      {errors.age && <span>Age Error</span>}

      <input type="submit" />
    </form>
  );
}
```

- register 함수의 두번째 매개변수에 validation 을 넣으면 된다.

## 4. Integrating an existing form

> **custom input에 대한 이야기**

```tsx
// type
type IFormValues = {
  "First Name": string;
  Age: number;
};
```

1. **UseFormRegister 함수 보내기**

   ```tsx
   // Example 1. The Following Component is an example of your existing Input Component
   type ExamOneProps = {
     label: Path<IFormValues>;
     register: UseFormRegister<IFormValues>;
     required?: boolean;
   };
   function Input({ label, register, required }: ExamOneProps) {
     return (
       <>
         <label>{label}</label>
         <input {...register(label, { required })} />
       </>
     );
   }

   <Input label="First Name" register={register} required />;
   ```

   > **Typescript Tip**

   - `label: Path<IFormValues>`
     Custom Input Component들은 자신이 어떤 멤버가 될지를 알 수 없다. First Name 혹은 Age가 될 수 있는 상황인데, react-hook-form의 Path 타입의 제네릭으로 해당 폼을 지정해주면, 후에 사용할 때 자동완성 기능을 사용할 수 있다.
   - `register: UseFormRegister<IFormValues>`
     useForm이 반환하게 될 함수 중 하나인 register 함수의 타입을 지정해준다.

2. **React.forwardRef 이용하기**

   ```tsx
   // Exampe 2. you can use React.forwardRef to pass the ref too
   type ConfigTwoProps = { label: string };
   interface ExamTwoProps
     extends ReturnType<UseFormRegister<IFormValues>>,
       ConfigTwoProps {}
   const Select = React.forwardRef<HTMLSelectElement, ExamTwoProps>(
     ({ onChange, onBlur, name, label }: ExamTwoProps, ref: any) => (
       <>
         <label>{label}</label>
         <select name={name} ref={ref} onChange={onChange} onBlur={onBlur}>
           <option value="20">20</option>
           <option value="30">30</option>
         </select>
       </>
     )
   );

   <Select label="Age" {...register("Age")} />;
   ```

   - React.forwardRef
     부모 컴포넌트에서 자식 컴포넌트로 ref를 전달하여, 부모가 자식 ref를 참조하는 기술이다.
     ```tsx
     function FancyButton(props) {
       return <button className="FancyButton">{props.children}</button>;
     }
     ```
     이러한 컴포넌트가 있을 때, 나는 지금까지 FancyButton으로의 props로 부터 button까지 넘겨주는 개념으로 사용했다. 하지만 이 방법은 사실상, 다른 컴포넌트는 내부 button DOM 요소에 대한 ref를 가져올 필요가 없다. FancyComponent가 ref를 받아, button으로 전달해주면 된다.
     ```tsx
     const FancyButton = React.forwardRef((props, ref) => (
       <button ref={ref} className="FancyButton">
         {props.children}
       </button>
     ));

     const ref = React.createRef();
     <FancyButton ref={ref}>Click me!</FancyButton>;
     ```
     이러한 상황은 고차컴포넌트에서도 발생하는데, 고차함수에서는 더 유용하게 사용할 수 있다.
     ```tsx
     function logProps(WrappedComponent) {
       class LogProps extends React.Component {
         componentDidUpdate(prevProps) {
           console.log("old props:", prevProps);
           console.log("new props:", this.props);
         }

         render() {
           return <WrappedComponent {...this.props} />;
         }
       }

       return LogProps;
     }
     ```
     이와 같이 모든 props를 로깅하는 HOC가 있을 때, 아래와 같이 감싸면 FancyButton으로 향하는 모든 props를 검사할 수 있다.
     ```tsx
     class FancyButton extends React.Component {
       focus() {
         // ...
       }

       // ...
     }

     export default logProps(FancyButton);
     ```
     - 하지만, ref는 props가 아니기 때문에, ref는 통과되지 않는다. 즉, HOC 상에서 WrappedComponent가 아닌, 가장 바깥쪽 컴포넌트를 참조하게 되는 것이다.
     - 해당 로직에서 사용자는 `<FancyButton ref={ref} />` 과 같은 형식으로 이를 호출할 것 이지만 logProps를 거치기 때문이다.
     - 그래서 React.forwardRef API를 사용하여 ref를 내부 Fancy Button 컴포넌트로 명시적으로 전달해준다.
     ```tsx
     function logProps(Component) {
       class LogProps extends React.Component {
         componentDidUpdate(prevProps) {
           console.log("old props:", prevProps);
           console.log("new props:", this.props);
         }

         render() {
           const { forwardedRef, ...rest } = this.props;
           return <Component ref={forwardedRef} {...rest} />;
         }
       }

       return React.forwardRef((props, ref) => {
         return <LogProps forwardedRef={ref} {...props} />;
       });
     }
     ```

   > **Typescript Tip**

   - 해당 Example은 React.forwardRef를 사용함으로서 부모 컴포넌트에서 Select Component 자체가 ref를 받는 것으로 보이도록 구성을 했다.
   - **Typescript 적 특성은 register 함수의 모든 반환값을 select 태그에 이용하는 것이 아닌, onChange, onBlur, name과 같은 반환값들 중의 일부만을 이용하기 위해 UseFormRegister 타입이 아닌, ReturnType<UseFormRegister> 타입을 이용한다.**
   - **label props 또한 부모 컴포넌트에서 useForm 생성 후에 보내주기 때문에, 부모 컴포넌트는 어떤 인풋 필드가 들어올지 알고 있다. 그래서 string으로 구성이 되었다.**

## 5. Integrating with UI libraries

```tsx
interface IFormValues {
  firstName: string;
  iceCreamType: { label: string; value: string };
}

function IntegratingWithUILib() {
  const { control, handleSubmit } = useForm<IFormValues>();

  const onSubmit: SubmitHandler<IFormValues> = (data: any) => {
    alert(JSON.stringify(data, null, "\t"));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="firstName"
        control={control}
        render={({ field }) => <Input {...field} />}
      />
      <Controller
        name="iceCreamType"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={[
              { value: "chocolate", label: "Chocolate" },
              { value: "strawberry", label: "Strawberry" },
              { value: "vanilla", label: "Vanilla" },
            ]}
          />
        )}
      />
      <input type="submit" />
    </form>
  );
}
```

- control이라는 새로운 요소를 사용한다. 후에 Controller의 props로 control 변수를 보내주면, field로, Controller가 control의 정보와 다른 props들을 통해 작업 수행 후, render를 통해 field 변수를 내려주며, 여기서 우리는 우리가 만든 UIComponent에 사용하면 된다.

## 6. Integrating Controlled Inputs

> **Controller as Element**

```tsx
function ContAsElement({ control }: { control: Control<IFormInputs> }) {
  return (
    <Controller
      name="MyCheckBox"
      control={control}
      rules={{ required: true }}
      render={({ field }) => <Checkbox {...field} />}
    />
  );
}
```

> **Controller as Hook ( useController )**

```tsx
function ContAsHook(props: UseControllerProps<IFormInputs>) {
  const { field, fieldState } = useController(props);

  return (
    <div>
      <input
        {...(field as InputHTMLAttributes<HTMLInputElement>)}
        placeholder={field.name}
      />
      <p>{fieldState.isTouched && "Touched"}</p>
      <p>{fieldState.isDirty && "Dirty"}</p>
      <p>{fieldState.invalid ? "invalid" : "valid"}</p>
    </div>
  );
}
```

> **Usage**

```tsx
function IntegratingContInputs() {
  const { handleSubmit, control, reset } = useForm<IFormInputs>({
    defaultValues: {
      TextField: "",
      MyCheckBox: false,
    },
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    alert(JSON.stringify(data, null, "\t"));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ContAsHook
        control={control}
        name="TextField"
        rules={{ required: true, minLength: 3, maxLength: 10 }}
      />
      <ContAsElement control={control} />
      <input type="submit" value="Submit :)" />
    </form>
  );
}
```

- 위의 예제에서 봤듯이, Controller Component는 register의 역할을 수행해준다. 이는 react-hook-form이 모든 기본 HTML에서 register의 동작으로 input의 필수 props들이 잘 동작하도록 했지만, 다른 UIComponent Library들과 함께할 때, 프로세스를 간소화하는 동시에 custom register를 자유롭게 사용하도록 하기 위한 철학이 담겨져있다.

## 7. Integrating with global state

```tsx
export default function App(props) {
  const { register, handleSubmit, setValue } = useForm();
  // Submit your data into Redux store
  const onSubmit = (data) => props.updateAction(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register("firstName")} defaultValue={props.firstName} />
      <Input {...register("lastName")} defaultValue={props.lastName} />
      <input type="submit" />
    </form>
  );
}

// Connect your component with redux
connect(
  ({ firstName, lastName }) => ({ firstName, lastName }),
  updateAction
)(YourForm);
```

- Redux Store와 함께 사용하는 경우, onSubmit에서 redux store의 action으로 데이터를 전달하도록 구성하면 된다.

## 8. Handle Errors

```tsx
function HandleErrors() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IFormInputs>();
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("firstName", { required: true })} />
      {errors.firstName && "FirstName is Required!"}
      <input {...register("lastName", { required: true })} />
      {errors.lastName && "LastName is Required!"}
      <input type="submit" value="Submit :)" />
    </form>
  );
}
```

- 해당 에러는 submit이 발생하는 순간 검사하여 error 객체를 업데이트 해준다.

## 9. Schema Validation ( Hello Yup! )

> **Step 1: Install Yup into project.**

```tsx
npm install @hookform/resolvers yup
```

- formik과 schema의 사용법에서 다른점은 @hookform/resolvers 라는 3rd party library를 설치해야 한다는 점이다.

> **Step 2: Prepare your schema for validation and register inputs with React Hook Form.**

```tsx
interface IFormInputs {
  firstName: string;
  age: number;
}

const schema = Yup.object({
  firstName: Yup.string().required(),
  age: Yup.number().positive().integer().required(),
});

const onSubmit: SubmitHandler<IFormInputs> = (data) => {
  alert(JSON.stringify(data, null, "\t"));
};

function SchemaValidation() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("firstName")} />
      <p>{errors.firstName?.message}</p>

      <input {...register("age")} />
      <p>{errors.age?.message}</p>

      <input type="submit" value="Submit :)" />
    </form>
  );
}
```

## 10. 정리

- react-hook-form은 formik에 비해, document를 간단하게 구성을 한 편이었다. 그래서 touched 상태에서의 validation을 일으키는 법 등이 등장하지 않았다. 그래서 더 세부적인 것들은 사용하면서, 공부하는 것이 좋을 것 같다. react-hook-form이 렌더링을 덜 일으킨다는 점에서 formik보다 매력적으로 다가왔다.

[API Documentation](https://react-hook-form.com/api)
