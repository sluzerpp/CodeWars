import { fetchGetOneTask } from '@/app/api';
import { ITask } from '@/shared/types';
import PlayTaskWidget from '@/widgets/PlayTaskWidget';
import { Stack } from '@mantine/core';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function TaskPage() {
  return (
    <div>
      <PlayTaskWidget></PlayTaskWidget>
    </div>
  );
}
