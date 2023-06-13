import { getTasks } from '@/app/store/actions';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { Select } from '@mantine/core';
import { useEffect } from 'react';

interface CreateTasksProps {
  value: string | null;
  setValue: CallableFunction;
}

export default function CreateTasks({ value, setValue }: CreateTasksProps) {
  const dispatch = useAppDispatch();
  const { isLoading, tasks } = useAppSelector((state) => state.task);

  useEffect(() => {
    dispatch(getTasks());
  }, []);

  const onChange = (val: string | null) => {
    setValue(val);
  };

  return (
    <div>
      {isLoading ? (
        <h2>Загрузка</h2>
      ) : (
        <Select
          placeholder="Выберите задание"
          searchable
          maxDropdownHeight={400}
          value={value}
          onChange={onChange}
          data={[
            { label: 'Новое задание', value: '' },
            ...tasks.map((task) => ({
              label: `${task.id} ${task.name} | ${task.rank.name} ${task.rank.number}`,
              value: String(task.id),
            })),
          ]}
        />
      )}
    </div>
  );
}
