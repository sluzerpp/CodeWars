import { ITask } from '@/shared/types';
import TaskCard from '../TaskCard';
import { Stack } from '@mantine/core';

interface TaskCardListProps {
  tasks: ITask[];
  disciplineId: number | undefined;
}

export default function TaskCardList({ tasks, disciplineId }: TaskCardListProps) {
  return (
    <Stack>
      {disciplineId
        ? tasks
            .filter((elem) => elem.discipline.id == disciplineId)
            .map((task) => <TaskCard key={task.id} task={task}></TaskCard>)
        : tasks.map((task) => <TaskCard key={task.id} task={task}></TaskCard>)}
    </Stack>
  );
}
