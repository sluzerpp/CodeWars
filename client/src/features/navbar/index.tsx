import { useAppSelector } from '@/app/store/hooks';
import { USER_ROLES } from '@/shared/enums';
import { Navbar, Title } from '@mantine/core';
import { Stack } from '@mui/material';
import { NavLink } from 'react-router-dom';

export default function NavigationBar() {
  const { user } = useAppSelector((state) => state.user);

  return (
    <Navbar width={{ base: 200 }} height={'100vh'} p="xs">
      <Stack>
        <Title order={2}>Навигация</Title>
        <NavLink to={'/'}>Задания</NavLink>
        <NavLink to={'/createtask'}>Создать задание</NavLink>
        <NavLink to={'/profile'}>Профиль</NavLink>
        <Title order={3}>Админка</Title>
        {user.role === USER_ROLES.admin && (
          <>
            <NavLink to={'/admin/discipline'}>Дисциплины</NavLink>
            <NavLink to={'/admin/rank'}>Ранги</NavLink>
          </>
        )}
        {/* {(user.role === USER_ROLES.moderator || user.role === USER_ROLES.admin) && (
          <NavLink to={'/admin/moderation'}>Модерирование</NavLink>
        )} */}
      </Stack>
    </Navbar>
  );
}
