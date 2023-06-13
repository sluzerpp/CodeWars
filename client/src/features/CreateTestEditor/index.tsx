import { Stack, Title } from '@mantine/core';
import styles from './index.module.scss';
import { EditorMap } from '@/app/Maps';
import CodeMirrorEditor from '@/shared/ui/Editor';

interface CreateCodeProps {
  code: string;
  setCode: CallableFunction;
  lang: string | null;
  title: string;
}

export default function CodeEditor({ code, setCode, lang, title }: CreateCodeProps) {
  let Editor = lang ? EditorMap.get(lang) : null;
  Editor = !Editor ? CodeMirrorEditor : Editor;

  return (
    <div className={styles.markdown}>
      <Stack>
        <Title order={5}>{title}</Title>
        <div className={styles.editor}>
          <Editor setValue={setCode} value={code}></Editor>
        </div>
      </Stack>
    </div>
  );
}
