import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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

export default SchemaValidation;
