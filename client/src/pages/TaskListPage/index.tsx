import { getTasks } from '@/app/store/actions';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import TaskCardList from '@/entities/TaskCardList';
import React, { useEffect } from 'react';

export default function TaskListPage() {
  const dispatch = useAppDispatch();
  const { isLoading, tasks, error } = useAppSelector((state) => state.task);

  useEffect(() => {
    dispatch(getTasks());
  }, []);

  return <div>{isLoading ? <h2>Загрузка</h2> : <TaskCardList tasks={tasks}></TaskCardList>}</div>;
}
