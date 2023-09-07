import {
  ICode,
  ICreateTaskData,
  IDiscipline,
  IJSTestResult,
  IRank,
  IRegData,
  ISolution,
  ISubmitSolution,
  ITask,
  ITestResult,
  ITokenResponse,
  IUser,
} from '@/shared/types';
import { $authHost, $host } from '../http';
import { LANGUAGES, TASK_STATE, USER_ROLES } from '@/shared/enums';

const fetchRegistration = async ({ nickname, email, role, password }: IRegData) => {
  console.log('herer');
  const response = await $host.post<ITokenResponse>('/user/registration', {
    nickname,
    email,
    password,
    role,
  });
  console.log(response);
  return response.data;
};

export const fetchUserRegistration = async (props: Omit<IRegData, 'role'>) => {
  const data = await fetchRegistration({ ...props, role: USER_ROLES.user });
  return data;
};

export const fetchAdminRegistration = async (props: Omit<IRegData, 'role'>) => {
  const data = await fetchRegistration({ ...props, role: USER_ROLES.admin });
  return data;
};

export const fetchModeratorRegistration = async (props: Omit<IRegData, 'role'>) => {
  const data = await fetchRegistration({ ...props, role: USER_ROLES.moderator });
  return data;
};

export const fetchAuth = async () => {
  const response = await $authHost.get<ITokenResponse>('/user/auth');
  return response.data;
};

export const fetchLogin = async (email: string, password: string) => {
  const response = await $host.post('/user/login', {
    email,
    password,
  });
  return response.data;
};

export const fetchUserData = async () => {
  const response = await $authHost.get<IUser>('/user');
  return response.data;
};

export const fetchCreateTask = async (props: ICreateTaskData) => {
  const response = await $authHost.post<ITask>('/task', props);
  return response.data;
};

export const fetchGetOneTask = async (id: number) => {
  const response = await $authHost.get<ITask>(`/user/task/${id}`);
  return response.data;
};

export const fetchGetAllTasks = async () => {
  const response = await $authHost.get<ITask[]>('/user/task');
  return response.data;
};

export const fetchUpdateTaskState = async (id: number, state: TASK_STATE) => {
  const response = await $authHost.put<ITask>(`/task/${id}`, { state });
  return response.data;
};

export const fetchDeleteTask = async (id: number | string) => {
  const response = await $authHost.delete<ITask>(`/task/${id}`);
  return response.data;
};

export const fetchGetAllSolution = async (id: number, lang: string) => {
  const response = await $authHost.post<ISolution[]>(`/task/${id}/solution/get`, { lang });
  return response.data;
};

export const fetchRunCodeTS = async (code: string, test: string) => {
  const response = await $authHost.post<IJSTestResult>('/run/ts', {
    code,
    test,
    lang: LANGUAGES.ts,
  });
  return response.data;
};

export const fetchRunCodeJS = async (code: string, test: string) => {
  const response = await $authHost.post<IJSTestResult>('/run/js', {
    code,
    test,
    lang: LANGUAGES.js,
  });
  return response.data;
};

export const fetchRunCodeCSharp = async (code: string, test: string) => {
  const response = await $authHost.post<ITestResult>('/run/cs', {
    code,
    test,
    lang: LANGUAGES.cs,
  });
  return response.data;
};

export const fetchRunCodeJava = async (code: string, test: string) => {
  const response = await $authHost.post<ITestResult>('/run/java', {
    code,
    test,
    lang: LANGUAGES.java,
  });
  return response.data;
};

export const RUN_FUNCS = {
  [String(LANGUAGES.cs)]: fetchRunCodeCSharp,
  [String(LANGUAGES.java)]: fetchRunCodeJava,
  [String(LANGUAGES.js)]: fetchRunCodeJS,
  [String(LANGUAGES.ts)]: fetchRunCodeTS,
};

export const fetchCreateRank = async (props: Omit<IRank, 'id' | 'createdAt' | 'updatedAt'>) => {
  const response = await $authHost.post<IRank>('/rank', props);
  return response.data;
};

export const fetchGetAllRanks = async () => {
  const response = await $authHost.get<IRank[]>('/rank');
  return response.data;
};

export const fetchDeleteRank = async (id: number | string) => {
  const response = await $authHost.delete<IRank>(`/rank/${id}`);
  return response.data;
};

export const fetchGetAllDisciplines = async () => {
  const response = await $authHost.get<IDiscipline[]>('/discipline');
  return response.data;
};

export const fetchCreateDiscipline = async (name: string, description: string) => {
  const response = await $authHost.post<IDiscipline>('/discipline', { name, description });
  return response.data;
};

export const fetchDeleteDiscipline = async (id: number | string) => {
  const response = await $authHost.delete<IDiscipline>(`/discipline/${id}`);
  return response.data;
};

export const fetchLanguages = async () => {
  const response = await $authHost.get<string[]>('/languages');
  return response.data;
};

export const fetchTaskCode = async (id: number | string, lang: string) => {
  const response = await $authHost.post<ICode>(`/task/${id}/code/get`, { lang });
  return response.data;
};

export const fetchTaskLang = async (id: number | string) => {
  const response = await $authHost.get<string[]>(`/task/${id}/code`);
  return response.data;
};

export const fetchCreateCode = async (
  solution: string,
  template: string,
  test: string,
  lang: string,
  taskId: number | string
) => {
  const response = await $authHost.post<ICode>(`/task/${taskId}/code`, {
    solution,
    template,
    test,
    lang,
  });
  return response.data;
};

export const fetchDeleteCode = async (taskId: number | string, lang: string) => {
  const response = await $authHost.delete<ICode>(`/task/${taskId}/code?lang=${lang}`);
  return response.data;
};

export const fetchGetSolution = async (taskId: number | string, lang: string) => {
  const response = await $authHost.post<ISolution>(`/task/${taskId}/solution`, { lang });
  return response.data;
};

export const fetchCompleteTask = async (taskId: number | string, code: string, lang: string) => {
  const response = await $authHost.put<ISubmitSolution>(`/user/task/${taskId}/`, {
    code,
    lang,
  });
  return response.data;
};
