import { fetchGetAllDisciplines } from '@/app/api';
import { IDiscipline } from '@/shared/types';
import { useEffect, useState } from 'react';

export default function useGetDisciplines(update?: boolean): [boolean, IDiscipline[]] {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IDiscipline[]>([]);

  const getData = () => {
    setIsLoading(true);
    fetchGetAllDisciplines().then((val) => {
      setData(val);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (update) {
      getData();
    }
  }, [update]);

  useEffect(() => {
    getData();
  }, []);

  return [isLoading, data];
}
