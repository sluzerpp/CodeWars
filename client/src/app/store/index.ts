import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import tokenSlice from './slices/tokenSlice';
import taskSlice from './slices/taskSlice';
import solutionSlice from './slices/solutionSlice';
import codeSlice from './slices/codeSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    token: tokenSlice,
    task: taskSlice,
    solution: solutionSlice,
    code: codeSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
