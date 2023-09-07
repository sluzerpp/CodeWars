import { useEffect, useState } from 'react';
import Markdown from '@/features/Markdown';
import Disciplines from '@/features/Disciplines';
import { Button, Group, Stack, Title } from '@mantine/core';
import styles from './index.module.scss';
import { TextField } from '@mui/material';
import Ranks from '@/features/Ranks';
import Languages from '@/features/Languages';
import CreateTasks from '@/features/CreateTasks';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { IJSTestResult, ITask, ITestResult } from '@/shared/types';
import CreateCode from '@/features/CreateCode';
import CreateTestEditor from '@/features/CreateTestEditor';
import {
  RUN_FUNCS,
  fetchCreateCode,
  fetchCreateTask,
  fetchDeleteCode,
  fetchTaskCode,
} from '@/app/api';
import { hideLoading, showError, showInfo, showLoading } from '../../shared/Notification';
import useResult from '@/shared/hooks/useResult';
import ResultView from '@/features/ResultsView';
import { AxiosError } from 'axios';
import { deleteTask, getTasks } from '@/app/store/actions';
import { taskActions } from '@/app/store/slices/taskSlice';

export default function CreateTaskWidget() {
  const dispatch = useAppDispatch();
  const [markdown, setMarkdown] = useState('');
  const [disciplineId, setDisciplineId] = useState<number>();
  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const [code, setCode] = useState('');
  const [template, setTemplate] = useState('');
  const [rank, setRank] = useState<string | null>(null);
  const [lang, setLang] = useState<string | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>('');
  const [test, setTest] = useState('');
  const [result, setResult] = useState<IJSTestResult | ITestResult | null>(null);
  const { isPassed, isError } = useResult(result);

  const { tasks } = useAppSelector((state) => state.task);

  const setTaskData = (task: ITask) => {
    setName(task.name);
    setRank(`${task.rank.id}`);
    setTags(task.tags);
    setDisciplineId(task.discipline.id);
    setMarkdown(task.description);
  };

  const onResetButtonClick = () => {
    const task = tasks.find((task) => task.id == Number(currentTaskId));
    if (task) {
      setTaskData(task);
    }
  };

  const setCodeField = async (id: number, lang: string) => {
    try {
      const code = await fetchTaskCode(id, lang);
      setTemplate(code.template || '');
      setCode(code.solution || '');
      setTest(code.test || '');
      showInfo('Код успешно загружен!');
    } catch (error) {
      setTemplate('');
      setCode('');
      setTest('');
      showError('Код для данного языка не реализован!');
    }
  };

  const onGetCodeBtnClick = async () => {
    const task = tasks.find((task) => task.id == Number(currentTaskId));
    if (task && lang) {
      setCodeField(task.id, lang);
    }
  };

  const onDeleteTaskBtnClick = async () => {
    if (!currentTaskId) {
      return showError('Выберите задание!');
    }
    showLoading('Удаляем задание!', 'deletetask');
    await dispatch(deleteTask(currentTaskId));
    hideLoading('deletetask');
    showInfo('Задание успешно удалено!');
  };

  const onCreateTaskBtnClick = async () => {
    if (!markdown) {
      return showError('Необходимо добавить описание!');
    }
    if (!name) {
      return showError('Необходимо добавить название!');
    }
    if (!rank) {
      return showError('Необходимо выбрать сложность!');
    }
    if (!disciplineId) {
      return showError('Необходимо выбрать дисциплину!');
    }
    if (!tags) {
      return showError('Необходимо ввести хотя бы 1 тег!');
    }
    showLoading('Создаём новое задание...', 'createtask');
    dispatch(taskActions.setLoading(true));
    const response = await fetchCreateTask({
      name,
      rankId: rank,
      disciplineId,
      description: markdown,
      tags,
      taskId: currentTaskId,
    });
    await dispatch(getTasks());
    dispatch(taskActions.setLoading(false));
    hideLoading('createtask');
    setCurrentTaskId(String(response.id));
  };

  const onCreateCodeBtnClick = async () => {
    if (!currentTaskId) {
      return showError('Необходимо выбрать или создать задание!');
    }
    if (!lang) {
      return showError('Необходимо выбрать один из языков!');
    }
    if (!code) {
      return showError('Необходимо заполнить решение!');
    }
    if (!test) {
      return showError('Необходимо заполнить тесты!');
    }
    if (!isPassed) {
      return showError('Код должен пройти проверку!');
    }
    await fetchCreateCode(code, template, test, lang, currentTaskId);
    showInfo('Код успешно создан!');
  };

  const onDeteleCodeBtnClick = async () => {
    if (!currentTaskId) {
      return showError('Необходимо выбрать или создать задание!');
    }
    if (!lang) {
      return showError('Необходимо выбрать один из языков!');
    }
    const task = tasks.find((task) => task.id == Number(currentTaskId));
    if (task) {
      try {
        await fetchDeleteCode(task.id, lang);
      } catch (error) {}
      showInfo('Код успешно удалён!');
    }
    setResult(null);
  };

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
    } catch (error) {
      const err = error as AxiosError;
      if (err.response && err.response.data) {
        setResult(err.response.data as IJSTestResult | ITestResult);
      }
    }
    hideLoading('execute');
  };

  const onLangChange = (lang: string | null) => {
    const task = tasks.find((task) => task.id == Number(currentTaskId));
    if (task && lang) {
      setCodeField(task.id, lang);
    }
  };

  useEffect(() => {
    const task = tasks.find((task) => task.id == Number(currentTaskId));
    if (task) {
      setTaskData(task);
    }
  }, [currentTaskId, tasks]);

  useEffect(() => {
    setResult(null);
  }, [lang]);

  const onInputChange =
    (setValue: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

  return (
    <>
      <Stack>
        <CreateTasks value={currentTaskId} setValue={setCurrentTaskId}></CreateTasks>
        <Button onClick={onResetButtonClick}>Вернуть исходные данные</Button>
        <div className={styles.grid}>
          <div className={styles.column}>
            <Stack>
              <Title order={4}>Название</Title>
              <TextField
                value={name}
                onChange={onInputChange(setName)}
                variant="outlined"
                label="Название"
                className={styles.input}
              ></TextField>
              <Title order={4}>Дисциплина</Title>
              <Disciplines value={disciplineId} setValue={setDisciplineId} />
              <Title order={4}>Теги (через запятую)</Title>
              <TextField
                value={tags}
                onChange={onInputChange(setTags)}
                variant="outlined"
                label="Теги"
                className={styles.input}
              ></TextField>
              <Title order={4}>Сложность</Title>
              <Ranks value={rank} setValue={setRank}></Ranks>
              <Title order={4}>Язык программирования</Title>
              <Languages value={lang} setValue={setLang} onLangChange={onLangChange}></Languages>
            </Stack>
          </div>
          <div className={styles.column}>
            <Stack>
              <Title order={4}>Описание</Title>
              <Markdown value={markdown} setValue={setMarkdown}></Markdown>
            </Stack>
          </div>
        </div>
        <hr className={styles.line} />
        <Title order={3}>Результаты</Title>
        <ResultView result={result} isError={isError} isPassed={isPassed}></ResultView>
        <hr className={styles.line} />
        <div className={styles.grid}>
          <div className={styles.column}>
            <Stack>
              <CreateCode
                setCode={setCode}
                code={code}
                template={template}
                setTemplate={setTemplate}
                lang={lang}
                onGetBtnClick={onGetCodeBtnClick}
                onDeleteCodeBtnClick={onDeteleCodeBtnClick}
              ></CreateCode>
            </Stack>
          </div>
          <div
            className={styles.column}
            style={{ alignItems: 'flex-end', gridTemplateRows: '1fr' }}
          >
            <Stack>
              <Group>
                <Button className={styles.green} onClick={onRunBtnClick}>
                  Проверить задание
                </Button>
                <Button disabled={!isPassed} onClick={onCreateCodeBtnClick}>
                  Создать/Обновить код
                </Button>
                <Button onClick={onCreateTaskBtnClick}>Создать/Обновить задание</Button>
                <Button className={styles.red} onClick={onDeleteTaskBtnClick}>
                  Удалить задание
                </Button>
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
