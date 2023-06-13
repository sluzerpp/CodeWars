import React, { useState } from 'react';
import styles from './index.module.scss';
import { Button, Group, Stack, Tabs } from '@mantine/core';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { EditorMarkdown } from '@/shared/ui/EditorMarkdown';

interface MarkdownProps {
  value?: string;
  setValue: CallableFunction;
}

export default function Markdown({ value, setValue }: MarkdownProps) {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className={styles.markdown}>
      <Stack>
        <Group>
          <Button onClick={() => setIsPreview(false)}>Редактор</Button>
          <Button onClick={() => setIsPreview(true)}>Предпросмотр</Button>
        </Group>
        <div className={styles.editor}>
          {isPreview ? (
            <MarkdownPreview className={styles.preview} source={value || ''}></MarkdownPreview>
          ) : (
            <EditorMarkdown value={value} setValue={setValue}></EditorMarkdown>
          )}
        </div>
      </Stack>
    </div>
  );
}
