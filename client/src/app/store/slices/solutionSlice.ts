import { ISolution } from '@/shared/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface solutionState {
  isLoading: boolean;
  solutions: ISolution[];
}

const initialState: solutionState = {
  isLoading: false,
  solutions: [],
};

const solutionSlice = createSlice({
  name: 'solutions',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    addItems(state, action: PayloadAction<ISolution[]>) {
      state.solutions.push(...action.payload);
    },
    addItem(state, action: PayloadAction<ISolution>) {
      const candidate = state.solutions.find((task) => task.id === action.payload.id);
      if (candidate) {
        state.solutions = state.solutions.filter((task) => task.id !== action.payload.id);
        state.solutions.push(action.payload);
      } else {
        state.solutions.push(action.payload);
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.solutions = state.solutions.filter((task) => task.id !== action.payload);
    },
    clearItems(state) {
      state.solutions = [];
    },
  },
});

export const solutionActions = solutionSlice.actions;

export default solutionSlice.reducer;
