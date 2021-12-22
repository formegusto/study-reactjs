import React from "react";
import {
  useForm,
  UseFormRegister,
  UseFormRegisterReturn,
} from "react-hook-form";

// Example 1. The Following Component is an example of your existing Input Component
type ExamOneProps = {
  label: string;
  register: UseFormRegister<any>;
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
interface ExamTwoProps extends UseFormRegisterReturn, ConfigTwoProps {}
const Select = React.forwardRef(
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
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
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
