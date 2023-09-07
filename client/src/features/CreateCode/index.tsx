import { Button, Group, Stack, Title } from '@mantine/core';
import { useState } from 'react';
import styles from './index.module.scss';
import { EditorMap } from '@/app/Maps';
import CodeMirrorEditor from '@/shared/ui/Editor';

interface CreateCodeProps {
  code: string;
  setCode: CallableFunction;
  template: string;
  setTemplate: CallableFunction;
  lang: string | null;
  onGetBtnClick: () => void;
  onDeleteCodeBtnClick: () => void;
}

export default function CreateCode({
  code,
  setCode,
  template,
  setTemplate,
  lang,
  onGetBtnClick,
  onDeleteCodeBtnClick,
}: CreateCodeProps) {
  const [isTemplate, setIsTemplate] = useState(false);
  let Editor = lang ? EditorMap.get(lang) : null;
  Editor = !Editor ? CodeMirrorEditor : Editor;

  return (
    <div className={styles.markdown}>
      <Stack>
        <Group>
          <Button onClick={() => setIsTemplate(false)}>Решение</Button>
          <Button onClick={() => setIsTemplate(true)}>Шаблон</Button>
          <Button onClick={onGetBtnClick}>Вернуть к исходным данным</Button>
          <Button className={styles.red} onClick={onDeleteCodeBtnClick}>
            Удалить код
          </Button>
        </Group>
        <Title order={5}>{isTemplate ? 'Шаблон' : 'Решение'}</Title>
        <div className={styles.editor}>
          {isTemplate ? (
            <Editor setValue={setTemplate} value={template}></Editor>
          ) : (
            <Editor setValue={setCode} value={code}></Editor>
          )}
        </div>
      </Stack>
    </div>
  );
}
