import styles from './index.module.scss';

interface TaskTagProps {
  tag: string;
  callback: () => void;
  title?: string;
  isDiscipline?: boolean;
}

export default function TaskTag({ tag, callback, title, isDiscipline }: TaskTagProps) {
  return (
    <button
      className={`${styles.btn} ${isDiscipline ? styles.blue : ''}`}
      title={title}
      onClick={callback}
    >
      {tag}
    </button>
  );
}
