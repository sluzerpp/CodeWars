import { ITask } from '@/shared/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface tasksState {
  isLoading: boolean;
  tasks: ITask[];
  error: string;
}

const initialState: tasksState = {
  isLoading: false,
  tasks: [],
  error: '',
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    addTasks(state, action: PayloadAction<ITask[]>) {
      state.tasks = action.payload;
    },
    addTask(state, action: PayloadAction<ITask>) {
      const candidate = state.tasks.find((task) => task.id === action.payload.id);
      if (candidate) {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload.id);
        state.tasks.push(action.payload);
      } else {
        state.tasks.push(action.payload);
      }
    },
    removeTask(state, action: PayloadAction<number>) {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    clearTasks(state) {
      state.tasks = [];
    },
  },
});

export const taskActions = taskSlice.actions;

export default taskSlice.reducer;
