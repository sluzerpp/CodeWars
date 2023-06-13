import { ICode } from '@/shared/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface codeState {
  isLoading: boolean;
  codes: ICode[];
}

const initialState: codeState = {
  isLoading: false,
  codes: [],
};

const codeSlice = createSlice({
  name: 'codes',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    addItems(state, action: PayloadAction<ICode[]>) {
      state.codes.push(...action.payload);
    },
    addItem(state, action: PayloadAction<ICode>) {
      const candidate = state.codes.find((task) => task.id === action.payload.id);
      if (candidate) {
        state.codes = state.codes.filter((task) => task.id !== action.payload.id);
        state.codes.push(action.payload);
      } else {
        state.codes.push(action.payload);
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.codes = state.codes.filter((task) => task.id !== action.payload);
    },
    clearItems(state) {
      state.codes = [];
    },
  },
});

export const codeActions = codeSlice.actions;

export default codeSlice.reducer;
