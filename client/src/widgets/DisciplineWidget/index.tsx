import { Button, Stack, Title } from '@mantine/core';
import { TextField } from '@mui/material';
import { useState } from 'react';
import styles from './index.module.scss';
import Disciplines from '@/features/Disciplines';
import { showError, showInfo } from '@/shared/Notification';
import { fetchCreateDiscipline, fetchDeleteDiscipline } from '@/app/api';
import { AxiosError } from 'axios';

export default function DisciplineWidget() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [disciplineId, setDisciplineId] = useState<number>();
  const [update, setUpdate] = useState(false);

  const onInputChange =
    (setValue: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

  const onDeleteBtnClick = async () => {
    if (!disciplineId) {
      return showError('Выберите дисциплину!');
    }
    try {
      await fetchDeleteDiscipline(disciplineId);
      setUpdate(true);
      setTimeout(() => {
        setUpdate(false);
      }, 0);
      showInfo('Дисциплина была удалена!');
    } catch (error) {
      const err = error as AxiosError;
      showError(err.message);
    }
  };

  const onCreateBtnClick = async () => {
    if (!name || !description) {
      return showError('Введите название и описание!');
    }
    try {
      await fetchCreateDiscipline(name, description);
      setUpdate(true);
      setTimeout(() => {
        setUpdate(false);
      }, 0);
      showInfo('Дисциплина была создана!');
    } catch (error) {
      const err = error as AxiosError;
      showError(err.message);
    }
  };

  return (
    <Stack>
      <Title order={3}>Создать новую дисциплину</Title>
      <Title order={4}>Название</Title>
      <TextField
        value={name}
        onChange={onInputChange(setName)}
        variant="outlined"
        label="Название"
        className={styles.input}
      ></TextField>
      <Title order={4}>Описание</Title>
      <TextField
        value={description}
        onChange={onInputChange(setDescription)}
        variant="outlined"
        label="Описание"
        className={styles.input}
      ></TextField>
      <Button onClick={onCreateBtnClick}>Создать дисциплину</Button>
      <Title order={3}>Удалить существующую дисциплину</Title>
      <Disciplines value={disciplineId} setValue={setDisciplineId} update={update}></Disciplines>
      <Button className={styles.red} onClick={onDeleteBtnClick}>
        Удалить дисциплину
      </Button>
    </Stack>
  );
}
