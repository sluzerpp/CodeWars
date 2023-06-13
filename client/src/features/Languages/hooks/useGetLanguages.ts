import { fetchLanguages } from '@/app/api';
import { useEffect, useState } from 'react';

export default function useGetLanguages(): [boolean, string[]] {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetchLanguages().then((val) => {
      setData(val);
      setIsLoading(false);
    });
  }, []);

  return [isLoading, data];
}
