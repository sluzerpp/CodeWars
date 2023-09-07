import { Dispatch } from 'redux';
import { tokenActions } from '../slices/tokenSlice';
import {
  fetchAuth,
  fetchDeleteTask,
  fetchGetAllTasks,
  fetchLogin,
  fetchUserData,
  fetchUserRegistration,
} from '@/app/api';
import { userActions } from '../slices/userSlice';
import { IRegData } from '@/shared/types';
import { AxiosError } from 'axios';
import { taskActions } from '../slices/taskSlice';

export const checkToken = () => async (dispatch: Dispatch) => {
  dispatch(tokenActions.setLoading(true));
  try {
    const data = await fetchAuth();
    dispatch(tokenActions.updateToken(data.token));
  } catch (error) {
    dispatch(tokenActions.setLoading(false));
  }
};

export const stopTokenLoading = () => (dispatch: Dispatch) => {
  dispatch(tokenActions.setLoading(false));
};

export const getUserData = () => async (dispatch: Dispatch) => {
  dispatch(userActions.setLoading(true));
  try {
    const response = await fetchUserData();
    dispatch(userActions.update(response));
  } catch (error) {}
  dispatch(userActions.setLoading(false));
};

export const setSignIn = (bool: boolean) => async (dispatch: Dispatch) => {
  dispatch(userActions.setAuth(bool));
};

export const createUser = (data: Omit<IRegData, 'role'>) => async (dispatch: Dispatch) => {
  dispatch(tokenActions.setLoading(true));
  try {
    const response = await fetchUserRegistration(data);
    dispatch(tokenActions.updateToken(response.token));
    localStorage.setItem('token', response.token);
  } catch (error) {
    const err = error as AxiosError;
    dispatch(tokenActions.setError(err.message));
  }
  dispatch(tokenActions.setLoading(false));
};

export const loginUser = (email: string, password: string) => async (dispatch: Dispatch) => {
  dispatch(tokenActions.setLoading(true));
  try {
    const response = await fetchLogin(email, password);
    dispatch(tokenActions.updateToken(response.token));
    localStorage.setItem('token', response.token);
  } catch (error) {
    const err = error as AxiosError;
    dispatch(tokenActions.setError(err.message));
  }
  dispatch(tokenActions.setLoading(false));
};

export const getTasks = () => async (dispatch: Dispatch) => {
  dispatch(taskActions.setLoading(true));
  try {
    const response = await fetchGetAllTasks();
    dispatch(taskActions.addTasks(response));
  } catch (error) {
    const err = error as AxiosError;
    dispatch(taskActions.setError(err.message));
  }
  dispatch(taskActions.setLoading(false));
};

export const deleteTask = (id: string | number) => async (dispatch: Dispatch) => {
  dispatch(taskActions.setLoading(true));
  try {
    await fetchDeleteTask(id);
    const response = await fetchGetAllTasks();
    dispatch(taskActions.addTasks(response));
  } catch (error) {
    const err = error as AxiosError;
    dispatch(taskActions.setError(err.message));
  }
  dispatch(taskActions.setLoading(false));
};

export const signOut = () => (dispatch: Dispatch) => {
  dispatch(userActions.update({}));
  localStorage.removeItem('token');
  dispatch(tokenActions.updateToken(''));
  dispatch(userActions.setAuth(false));
};
