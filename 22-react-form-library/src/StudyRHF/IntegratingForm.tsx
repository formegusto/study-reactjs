import React from "react";
import { Path, SubmitHandler, useForm, UseFormRegister } from "react-hook-form";

type IFormValues = {
  "First Name": string;
  Age: number;
};

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

function IntegratingForm() {
  const { register, handleSubmit } = useForm<IFormValues>();

  const onSubmit: SubmitHandler<IFormValues> = (data: any) => {
    alert(JSON.stringify(data, null, "\t"));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="First Name" register={register} required />
      <Select label="Age" {...register("Age")} />
      <input type="submit" />
    </form>
  );
}

export default IntegratingForm;
