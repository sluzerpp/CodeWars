import { Group } from '@mantine/core';
import useGetDisciplines from './hooks/useGetDisciplines';
import DisciplineButton from './Button';

interface DisciplinesProps {
  value: number | undefined;
  setValue: CallableFunction;
  update?: boolean;
}

export default function Disciplines({ value, setValue, update }: DisciplinesProps) {
  const [isLoading, disciplines] = useGetDisciplines(update);
  const buttonClickHandler = (id: number) => () => {
    setValue(id);
  };

  return (
    <div>
      {isLoading ? (
        <h2>Загрузка</h2>
      ) : (
        <Group>
          {disciplines.map((disc) => (
            <DisciplineButton
              key={disc.id}
              isActive={value === disc.id}
              discipline={disc}
              callback={buttonClickHandler(disc.id)}
            ></DisciplineButton>
          ))}
        </Group>
      )}
    </div>
  );
}
