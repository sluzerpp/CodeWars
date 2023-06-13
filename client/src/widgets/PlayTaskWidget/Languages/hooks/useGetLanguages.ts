import { fetchTaskLang } from '@/app/api';
import { useEffect, useState } from 'react';

export default function useGetLanguages(taskId: number | string): [boolean, string[]] {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetchTaskLang(taskId).then((val) => {
      setData(val);
      setIsLoading(false);
    });
  }, [taskId]);

  return [isLoading, data];
}
