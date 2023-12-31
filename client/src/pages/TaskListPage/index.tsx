import { getTasks } from '@/app/store/actions';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import TaskCardList from '@/entities/TaskCardList';
import Disciplines from '@/features/Disciplines';
import { Stack } from '@mantine/core';
import { useEffect, useState } from 'react';

export default function TaskListPage() {
  const dispatch = useAppDispatch();
  const { isLoading, tasks } = useAppSelector((state) => state.task);
  const [disciplineId, setDisciplineId] = useState<number>();

  useEffect(() => {
    dispatch(getTasks());
  }, []);

  return (
    <div>
      {isLoading ? (
        <h2>Загрузка</h2>
      ) : (
        <Stack>
          <Disciplines setValue={setDisciplineId} value={disciplineId}></Disciplines>
          <TaskCardList disciplineId={disciplineId} tasks={tasks}></TaskCardList>
        </Stack>
      )}
    </div>
  );
}
