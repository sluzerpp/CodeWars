import { IDiscipline } from '@/shared/types';
import styles from './index.module.scss';

interface DisciplineButtonProps {
  discipline: IDiscipline;
  callback: () => void;
  isActive: boolean;
}

export default function DisciplineButton({
  discipline,
  callback,
  isActive,
}: DisciplineButtonProps) {
  return (
    <button
      className={`${styles.button} ${isActive ? styles.active : ''}`}
      onClick={callback}
      title={discipline.description}
    >
      {discipline.name}
    </button>
  );
}
