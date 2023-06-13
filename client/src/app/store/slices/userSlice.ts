import { IUser } from '@/shared/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface UserState {
  user: IUser;
  isAuth: boolean;
  isLoading: boolean;
  error: string;
}

const initialState: UserState = {
  user: {
    id: -1,
    nickname: '',
    email: '',
    role: '',
    exp: 0,
    status: '',
    rank: '',
  },
  isAuth: false,
  isLoading: false,
  error: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setAuth(state, action: PayloadAction<boolean>) {
      state.isAuth = action.payload;
    },
    update(state, action: PayloadAction<Partial<IUser>>) {
      state.user = { ...state.user, ...action.payload };
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
