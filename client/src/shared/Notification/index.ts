import { notifications } from '@mantine/notifications';

export const showError = (message: string) => {
  notifications.show({
    withCloseButton: true,
    autoClose: 3000,
    title: 'Ошибка!',
    message,
    color: 'red',
  });
};

export const showInfo = (message: string) => {
  notifications.show({
    withCloseButton: true,
    autoClose: 3000,
    title: 'Информация!',
    message,
  });
};

export const showLoading = (message: string, id: string) => {
  notifications.show({
    id,
    withCloseButton: true,
    title: 'Загрузка...',
    message,
    autoClose: false,
    loading: true,
  });
};

export const hideLoading = (id: string) => {
  notifications.hide(id);
};
