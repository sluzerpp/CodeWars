import { ITask } from '@/shared/types';
import styles from './index.module.scss';
import TaskCard from '../TaskCard';
import { Stack } from '@mantine/core';

interface TaskCardListProps {
  tasks: ITask[];
}

export default function TaskCardList({ tasks }: TaskCardListProps) {
  return (
    <Stack>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task}></TaskCard>
      ))}
    </Stack>
  );
}
