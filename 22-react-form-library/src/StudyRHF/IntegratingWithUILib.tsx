import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Input from "@material-ui/core/Input";
import Select from "react-select";

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

export default IntegratingWithUILib;
