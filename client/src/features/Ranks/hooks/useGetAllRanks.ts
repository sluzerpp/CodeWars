import { fetchGetAllRanks } from '@/app/api';
import { IRank } from '@/shared/types';
import { useEffect, useState } from 'react';

export default function useGetAllRanks(update?: boolean): [boolean, IRank[]] {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IRank[]>([]);

  const getData = () => {
    setIsLoading(true);
    fetchGetAllRanks().then((val) => {
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
