import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface tokenState {
  isLoading: boolean;
  token?: string;
  error: string;
}

const initialState: tokenState = {
  isLoading: true,
  error: '',
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    updateToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const tokenActions = tokenSlice.actions;

export default tokenSlice.reducer;
