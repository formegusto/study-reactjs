import { AxiosResponse } from 'axios';
import { DependencyList, useEffect, useState } from 'react';

export default function usePromise<T = any, PR = AxiosResponse<T>>(
  promiseCreator: () => Promise<PR>,
  deps: DependencyList,
): [boolean, PR | null, any] {
  const [loading, setLoading] = useState<boolean>(false);
  const [resolved, setResolved] = useState<PR | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const process = async () => {
      setLoading(true);
      try {
        const resolved = await promiseCreator();
        setResolved(resolved);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    process();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return [loading, resolved, error];
}
