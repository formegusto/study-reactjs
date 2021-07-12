import { ReactElement, useEffect, useState } from "react";

type Props = {
  onRender: () => ReactElement;
};

function TimeViewEmpty({ onRender }: Props): ReactElement {
  const [render, setRender] = useState<ReactElement | null>(null);
  useEffect(() => {
    setRender(onRender);
  }, [setRender, onRender]);

  return render ? render : <></>;
}

export default TimeViewEmpty;
