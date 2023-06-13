import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import SignInSide from './LoginPage';
import SignUpSide from './RegPage';
import { useAppSelector } from '@/app/store/hooks';
import useAuth from '@/app/hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';
import TaskListPage from './TaskListPage';
import TaskPage from './TaskPage';
import ProfilePage from './ProfilePage';
import { AppShell, MantineProvider } from '@mantine/core';
import CreateTaskPage from './AdminPages/TaskPage';
import NavigationBar from '@/features/navbar';
import { USER_ROLES } from '@/shared/enums';
import DisciplinePage from './AdminPages/DisciplinePage';
import ModerationPage from './AdminPages/ModerationPage';
import HeaderElem from '@/features/header';
import { Notifications } from '@mantine/notifications';
import RankPage from './AdminPages/RankPage';

export default function Routing() {
  const [isLogin, isFetch] = useAuth();
  const url = useLocation();
  const navigate = useNavigate();
  const [userUrl, setUserUrl] = useState('');
  const { user } = useAppSelector((state) => state.user);
  const { isAuth } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (url.pathname !== '/signin' && url.pathname !== '/signup' && !isAuth && !isFetch) {
      setUserUrl(url.pathname);
      navigate('/signin');
    } else if (isAuth && userUrl) {
      const urlCopy = userUrl;
      setUserUrl('');
      navigate(urlCopy);
    }
  }, [isAuth, userUrl]);

  if (user.role === USER_ROLES.user && location.pathname.includes('admin')) {
    return <Navigate to={'/'}></Navigate>;
  }

  if (
    location.pathname.includes('admin') &&
    user.role === USER_ROLES.moderator &&
    location.pathname !== '/admin/moderation'
  ) {
    return <Navigate to={'/admin/moderation'}></Navigate>;
  }

  if (!isAuth && !isFetch) {
    return (
      <Routes>
        <Route path="/signin" element={<SignInSide></SignInSide>}></Route>
        <Route path="/signup" element={<SignUpSide></SignUpSide>}></Route>
      </Routes>
    );
  }

  return isFetch ? (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  ) : (
    <>
      <MantineProvider>
        <Notifications></Notifications>
      </MantineProvider>
      <AppShell navbar={<NavigationBar></NavigationBar>} header={<HeaderElem></HeaderElem>}>
        <Routes>
          <Route path="/" element={<TaskListPage />}></Route>
          <Route path="/profile" element={<ProfilePage />}></Route>
          <Route path="/task/:id" element={<TaskPage />}></Route>
          <Route path="/createtask" element={<CreateTaskPage></CreateTaskPage>} />
          <Route path="/admin/moderation" element={<ModerationPage></ModerationPage>}></Route>
          <Route path="/admin/discipline" element={<DisciplinePage></DisciplinePage>}></Route>
          <Route path="/admin/rank" element={<RankPage></RankPage>}></Route>
          <Route path="*" element={<Navigate to={'/'} />} />
        </Routes>
      </AppShell>
    </>
  );
}
