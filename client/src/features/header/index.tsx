import { signOut } from '@/app/store/actions';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { Button, Group, Header, Title } from '@mantine/core';

export default function HeaderElem() {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const onSignOutBtnClick = () => {
    dispatch(signOut());
  };

  return (
    <Header height={60}>
      <Group position="apart">
        <Title order={1}>CodeWars</Title>
        {user && user.rank && (
          <Group>
            {/* <Title order={5}>{user.exp}</Title>
            <Rank rank={user.rank}></Rank> */}
            <Button onClick={onSignOutBtnClick}>Выйти</Button>
          </Group>
        )}
      </Group>
    </Header>
  );
}
