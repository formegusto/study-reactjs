import axios from 'axios';
import React, { useState } from 'react';

type ApiResult = {
  title: string;
  completed: boolean;
};

function App() {
  const [data, setData] = useState<ApiResult>();

  const onClick = async () => {
    try {
      const res = await axios.get<ApiResult>(
        'https://jsonplaceholder.typicode.com/todos/1',
      );
      setData(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div>
        <button onClick={onClick}>불러오기</button>
      </div>
      {data && (
        <textarea rows={7} value={JSON.stringify(data, null, 2)} readOnly />
      )}
    </div>
  );
}

export default App;
