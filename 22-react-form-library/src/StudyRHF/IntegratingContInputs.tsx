import { Checkbox } from "@material-ui/core";
import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";
import {
  Controller,
  SubmitHandler,
  useForm,
  Control,
  UseControllerProps,
  useController,
} from "react-hook-form";

interface IFormInputs {
  TextField: string;
  MyCheckBox: boolean;
}

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

export default IntegratingContInputs;
