import { SubmitHandler, useForm } from "react-hook-form";

interface IFormInputs {
  firstName: string;
  lastName: string;
}

const onSubmit: SubmitHandler<IFormInputs> = (data) => {
  alert(JSON.stringify(data, null, "\t"));
};

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

export default HandleErrors;
