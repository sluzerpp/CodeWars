import { useEffect, useState } from 'react';
import { Button, Group, Stack, Title } from '@mantine/core';
import styles from './index.module.scss';
import { IJSTestResult, ITask, ITestResult } from '@/shared/types';
import CreateTestEditor from '@/features/CreateTestEditor';
import {
  RUN_FUNCS,
  fetchCompleteTask,
  fetchGetOneTask,
  fetchGetSolution,
  fetchTaskCode,
} from '@/app/api';
import { hideLoading, showError, showInfo, showLoading } from '../../shared/Notification';
import useResult from '@/shared/hooks/useResult';
import ResultView from '@/features/ResultsView';
import { AxiosError } from 'axios';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { Link, useParams } from 'react-router-dom';
import TaskLanguages from './Languages';

export default function PlayTaskWidget() {
  const { id } = useParams();
  const [code, setCode] = useState('');
  const [test, setTest] = useState('');
  const [lang, setLang] = useState<string | null>(null);
  const [result, setResult] = useState<IJSTestResult | ITestResult | null>(null);
  const { isPassed, isError } = useResult(result);
  const [isResult, setIsResult] = useState(false);
  const [task, setTask] = useState<ITask | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const onRunBtnClick = async () => {
    if (!code) {
      return showError('Отсутствует решение!');
    }
    if (!test) {
      return showError('Отсутствуют тесты!');
    }
    if (!lang) {
      return showError('Не выбран язык!');
    }
    const func = RUN_FUNCS[lang];
    try {
      showLoading('Код выполняется!', 'execute');
      const result = await func(code, test);
      setResult(result);
      setIsResult(true);
    } catch (error) {
      const err = error as AxiosError;
      if (err.response && err.response.data) {
        setResult(err.response.data as IJSTestResult | ITestResult);
      }
    }
    hideLoading('execute');
  };

  useEffect(() => {
    setResult(null);
  }, [lang]);

  useEffect(() => {
    fetchGetOneTask(Number(id))
      .then((val) => {
        setTask(val);
        console.log(val);
        if (val.userTask) {
          if (val.userTask.state === 'COMPLETED') {
            setIsComplete(true);
          }
        }
      })
      .catch((err: AxiosError) => {
        setError(err.message);
      });
  }, [id]);

  const setCodeField = async (taskId: number, lang: string) => {
    try {
      const response = await fetchTaskCode(taskId, lang);
      setCode(response.template);
      setTest(response.test);
    } catch (error) {
      showError('Код для данного языка отсутствует!');
    }
  };

  const setSolution = async (taskId: number, lang: string, info?: boolean) => {
    try {
      const response = await fetchGetSolution(taskId, lang);
      setCode(response.code);
      console.log(response);
    } catch (error) {
      if (info) {
        showError('Вы ещё не решали эту задачу на этом языке!');
      }
    }
  };

  const onLangChange = (lang: string | null) => {
    if (task && lang) {
      setCodeField(task.id, lang);
      setSolution(task.id, lang);
    }
  };

  const onResetBtnClick = () => {
    if (task && lang) {
      setCodeField(task.id, lang);
    }
  };

  const onSetSolutionBtnClick = () => {
    if (task && lang) {
      setSolution(task.id, lang, true);
    }
  };

  const onSubmitBtnClick = async () => {
    if (!task) return;
    if (!lang) {
      return showError('Выберите язык!');
    }
    if (!code) {
      return showError('Необходимо ввести решение!');
    }
    try {
      showLoading('Код выполняется!', 'execute');
      const taskResult = await fetchCompleteTask(task.id, code, lang);
      setResult(taskResult.result);
      setIsResult(true);
      setIsComplete(taskResult.completed);
      if (taskResult.completed) {
        showInfo('Задание выполнено!');
      } else {
        showInfo('Задание не выполнено!');
      }
    } catch (error) {
      const err = error as AxiosError;
      if (err.response && err.response.data) {
        setResult(err.response.data as IJSTestResult | ITestResult);
      }
    }
    hideLoading('execute');
  };

  if (error) {
    return <h2>Задание не найдено!</h2>;
  }

  if (task) {
    return (
      <>
        <Stack>
          <Title order={2}>
            {task.name}
            {isComplete ? ' - Выполнено' : ''}
          </Title>
          <TaskLanguages
            taskId={task.id}
            value={lang}
            setValue={setLang}
            onLangChange={onLangChange}
          ></TaskLanguages>
          <div className={styles.grid}>
            <div className={styles.column}>
              <Stack>
                <Group>
                  <Button onClick={() => setIsResult(false)}>Описание</Button>
                  <Button onClick={() => setIsResult(true)}>Результат</Button>
                  <Button onClick={onResetBtnClick}>Установить шаблон</Button>
                  <Button onClick={onSetSolutionBtnClick}>Установить решение</Button>
                </Group>
                <div className={styles.editor}>
                  {!isResult ? (
                    <MarkdownPreview
                      className={styles.preview}
                      source={task.description || ''}
                    ></MarkdownPreview>
                  ) : (
                    <ResultView result={result} isError={isError} isPassed={isPassed}></ResultView>
                  )}
                </div>
              </Stack>
            </div>
            <div className={styles.column}>
              <Stack>
                <CreateTestEditor
                  title="Ваше решение"
                  code={code}
                  setCode={setCode}
                  lang={lang}
                ></CreateTestEditor>
                <Group>
                  <Button onClick={onRunBtnClick}>Тестировать</Button>
                  <Button className={styles.green} onClick={onSubmitBtnClick}>
                    Выполнить
                  </Button>
                  <Link to={isComplete ? `/solution/${task.id}` : ''}>
                    <Button disabled={!isComplete}>Посмотреть решения</Button>
                  </Link>
                </Group>
                <CreateTestEditor
                  title="Тесты"
                  code={test}
                  setCode={setTest}
                  lang={lang}
                ></CreateTestEditor>
              </Stack>
            </div>
          </div>
        </Stack>
      </>
    );
  }

  return null;
}
