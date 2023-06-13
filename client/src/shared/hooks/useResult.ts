import { useEffect, useState } from 'react';
import { IJSTestResult, ITestResult } from '../types';

export default function useResult(result: IJSTestResult | ITestResult | null) {
  const [isPassed, setIsPassed] = useState(false);
  const [isError, setIsError] = useState('');

  useEffect(() => {
    if (result) {
      if (result.totalFailed === 0) {
        setIsPassed(true);
      } else {
        setIsPassed(false);
      }

      if (result.error) {
        setIsError(result.error);
      } else {
        setIsError('');
      }
    }
  }, [result]);

  return { isPassed, isError };
}
