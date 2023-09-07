import { getTasks } from '@/app/store/actions';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import TaskCardList from '@/entities/TaskCardList';
import Disciplines from '@/features/Disciplines';
import { ITask } from '@/shared/types';
import { Stack, Title } from '@mantine/core';
import { useState, useEffect } from 'react';

export default function ProfileWidget() {
  const dispatch = useAppDispatch();
  const { isLoading, tasks } = useAppSelector((state) => state.task);
  const [disciplineId, setDisciplineId] = useState<number>();
  const [userTasks, setUserTasks] = useState<ITask[]>([]);

  useEffect(() => {
    if (tasks.length > 0) {
      setUserTasks(
        tasks.filter((task) => {
          if (task.userTask && task.userTask.state === 'COMPLETED') {
            return true;
          }
          return false;
        })
      );
    }
  }, [tasks]);

  useEffect(() => {
    dispatch(getTasks());
  }, []);

  return (
    <div>
      {isLoading ? (
        <h2>Загрузка</h2>
      ) : (
        <Stack>
          <Title order={2}>Выполненные задания</Title>
          <Disciplines setValue={setDisciplineId} value={disciplineId}></Disciplines>
          <TaskCardList disciplineId={disciplineId} tasks={userTasks}></TaskCardList>
        </Stack>
      )}
    </div>
  );
}
