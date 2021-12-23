import { SubmitHandler, useForm } from "react-hook-form";

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

export default ApplyValidation;
