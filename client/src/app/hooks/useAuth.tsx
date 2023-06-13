import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkToken, getUserData, setSignIn, stopTokenLoading } from '../store/actions';

export default function useAuth() {
  const [isLogin, setIsLogin] = useState(false);
  const [isFetch, setIsFetch] = useState(false);
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.token);
  const { isLoading } = useAppSelector((state) => state.user);

  const callback = useCallback(() => {
    if (!isLoading) {
      if (token) {
        localStorage.setItem('token', token);
        dispatch(getUserData());
        dispatch(setSignIn(true));
        setIsLogin(true);
      }
      dispatch(stopTokenLoading());
      setIsFetch(false);
    }
  }, [token]);

  useEffect(() => {
    setIsFetch(true);
    const localToken = localStorage.getItem('token');
    if (localToken) {
      dispatch(checkToken());
    }
  }, []);

  useEffect(() => {
    callback();
  }, [token]);

  return [isLogin, isFetch];
}
