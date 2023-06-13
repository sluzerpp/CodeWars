import { ITask } from '@/shared/types';
import { Button, Group, Stack, Title } from '@mantine/core';
import styles from './index.module.scss';
import Rank from '@/shared/ui/Rank';
import TaskTag from '@/shared/ui/TaskTag';
import { Link } from 'react-router-dom';

interface TaskCardProps {
  task: ITask;
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className={styles.card}>
      <Stack>
        <Group position="apart">
          <Title order={2}>{task.name}</Title>
          <Rank rank={task.rank}></Rank>
        </Group>
        <Group position="apart">
          <Group>
            <TaskTag
              callback={() => {}}
              title={task.discipline.description}
              isDiscipline={true}
              tag={task.discipline.name}
            ></TaskTag>
            {task.tags.split(',').map((tag, id) => (
              <TaskTag key={tag + id} callback={() => {}} tag={tag} />
            ))}
          </Group>
          <Link to={`/task/${task.id}`}>
            <Button>Начать</Button>
          </Link>
        </Group>
      </Stack>
    </div>
  );
}
