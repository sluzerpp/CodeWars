import { Button, ColorInput, Stack, Title } from '@mantine/core';
import { TextField } from '@mui/material';
import React, { useState } from 'react';
import styles from './index.module.scss';
import { showError, showInfo } from '@/shared/Notification';
import { fetchCreateRank, fetchDeleteRank } from '@/app/api';
import { AxiosError } from 'axios';
import Ranks from '@/features/Ranks';

export default function RankWidget() {
  const [name, setName] = useState('');
  const [number, setNumber] = useState<number | null>(null);
  const [expFrom, setExpFrom] = useState<number | null>(null);
  const [expReward, setExpReward] = useState<number | null>(null);
  const [colorName, setColorName] = useState('');
  const [colorHEX, setColorHEX] = useState('');
  const [rank, setRank] = useState<string | null>(null);
  const [update, setUpdate] = useState(false);

  const onInputChange =
    (setValue: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

  const onDeleteBtnClick = async () => {
    if (!rank) {
      return showError('Выберите ранг!');
    }
    try {
      await fetchDeleteRank(rank);
      setUpdate(true);
      setTimeout(() => {
        setUpdate(false);
      }, 0);
      showInfo('Ранг был удален!');
    } catch (error) {
      const err = error as AxiosError;
      showError(err.message);
    }
  };

  const onCreateBtnClick = async () => {
    if (!name || !number) {
      return showError('Введите название и номер!');
    }
    if (expFrom === null || expReward === null) {
      return showError('Введите значения "Начиная с" и награды ');
    }
    if (!colorName || !colorHEX) {
      return showError('Введите название цвета и его HEX кодировку!');
    }
    try {
      await fetchCreateRank({
        name,
        number,
        expFrom,
        expReward,
        colorHEX,
        colorName,
      });
      setUpdate(true);
      setTimeout(() => {
        setUpdate(false);
      }, 0);
      showInfo('Ранг был создан!');
    } catch (error) {
      const err = error as AxiosError;
      showError(err.message);
    }
  };

  return (
    <Stack>
      <Title order={3}>Создать новый ранг</Title>
      <TextField
        value={name}
        onChange={onInputChange(setName)}
        variant="outlined"
        label="Название"
        className={styles.input}
      ></TextField>
      <TextField
        value={number}
        type="number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumber(Number(e.target.value))}
        variant="outlined"
        label="Номер"
        className={styles.input}
      ></TextField>
      <TextField
        value={expFrom}
        type="number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExpFrom(Number(e.target.value))}
        variant="outlined"
        label="Начиная с"
        className={styles.input}
      ></TextField>
      <TextField
        value={expReward}
        type="number"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExpReward(Number(e.target.value))}
        variant="outlined"
        label="Награда"
        className={styles.input}
      ></TextField>
      <ColorInput placeholder="Цвет ранга" value={colorHEX} onChange={setColorHEX} />
      <TextField
        value={colorName}
        onChange={onInputChange(setColorName)}
        variant="outlined"
        label="Название цвета"
        className={styles.input}
      ></TextField>
      <Button onClick={onCreateBtnClick}>Создать ранг</Button>
      <Title order={3}>Удалить существующий ранг</Title>
      <Ranks value={rank} setValue={setRank} update={update}></Ranks>
      <Button className={styles.red} onClick={onDeleteBtnClick}>
        Удалить ранг
      </Button>
    </Stack>
  );
}
