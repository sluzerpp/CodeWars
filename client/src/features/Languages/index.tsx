import { Select } from '@mantine/core';
import './index.scss';
import useGetLanguages from './hooks/useGetLanguages';

interface LanguagesProps {
  value: string | null;
  setValue: CallableFunction;
  onLangChange: (val: string | null) => void;
}

export default function Languages({ value, setValue, onLangChange }: LanguagesProps) {
  const [isLoading, languages] = useGetLanguages();

  const onChange = (val: string | null) => {
    setValue(val);
    onLangChange(val);
  };

  return (
    <div>
      {isLoading ? (
        <h2>Загрузка</h2>
      ) : (
        <Select
          placeholder="Выберите язык"
          maxDropdownHeight={400}
          value={value}
          onChange={onChange}
          data={languages}
        />
      )}
    </div>
  );
}
