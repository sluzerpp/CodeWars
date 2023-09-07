import { ISolution } from '@/shared/types';
import { Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TaskLanguages from '../PlayTaskWidget/Languages';
import { fetchGetAllSolution } from '@/app/api';
import MarkdownPreview from '@uiw/react-markdown-preview';

export default function SolutionWidget() {
  const { id } = useParams();
  const [lang, setLang] = useState<string | null>(null);
  const [solutions, setSolutions] = useState<ISolution[]>([]);

  const onLangChange = () => {};

  useEffect(() => {
    if (lang) {
      fetchGetAllSolution(Number(id), lang).then((val) => {
        setSolutions(val);
      });
    }
  }, [lang, id]);

  return (
    <Stack>
      {id && (
        <>
          <TaskLanguages
            taskId={id}
            value={lang}
            setValue={setLang}
            onLangChange={onLangChange}
          ></TaskLanguages>
          {solutions.length > 0 &&
            solutions.map((val) => {
              return (
                <MarkdownPreview key={val.id} source={`${'```'}${val.code}`}></MarkdownPreview>
              );
            })}
        </>
      )}
    </Stack>
  );
}
