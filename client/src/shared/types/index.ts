export interface IUser {
  id: number;
  nickname: string;
  email: string;
  role: string;
  exp: number;
  status: string;
  rank: IRank;
}

export interface IRegData {
  nickname: string;
  email: string;
  role: string;
  password: string;
}

export interface IRank {
  id: number;
  name: string;
  number: number;
  expFrom: number;
  expReward: number;
  colorName: string;
  colorHEX: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateRankData {
  name: string;
  number: number;
  expFrom: number;
  expReward: number;
  colorName: string;
  colorHEX: string;
}

export interface IDiscipline {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITask {
  id: number;
  name: string;
  description: string;
  tags: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  rank: IRank;
  discipline: IDiscipline;
  userTask?: IUserTask;
}

export interface ICreateTaskData {
  taskId: number | string | null;
  name: string;
  description: string;
  tags: string;
  rankId: number | string;
  disciplineId: number | string;
}

export interface IJSTest {
  title: string;
  fullTitle: string;
  timedOut: boolean;
  duration: number;
  state: string;
  pass: boolean;
  fail: boolean;
  pending: boolean;
  code: string;
  err: {
    message: string;
    estack: string;
    diff: string;
  };
  skipped: boolean;
}

export interface IJSSuite {
  uuid: string;
  title: string;
  tests: IJSTest[];
  suites: IJSSuite[];
  passes: string[];
  failures: string[];
  pending: string[];
  skipped: string[];
  duration: number;
}

export interface IJSTestResult {
  totalDuration: number;
  totalPassed: number;
  totalFailed: number;
  suites: IJSSuite[];
  error?: string;
}

export interface ITestCase {
  name: string;
  classname: string;
  time: string;
  result: string;
  failure?: string;
}

export interface ITestResult {
  totalDuration: string;
  totalPassed: number;
  totalFailed: number;
  testCases: ITestCase[];
  error?: string;
}

export interface ICode {
  id: number;
  template: string;
  solution: string;
  test: string;
  lang: string;
  taskId: number;
  updatedAt: string;
  createdAt: string;
}

export interface IUserTask {
  id: number;
  state: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  taskId: number;
}

export interface ISolution {
  id: number;
  code: string;
  lang: string;
  createdAt: string;
  updatedAt: string;
  taskId: number;
  userId: number;
}

export interface ITokenResponse {
  token: string;
}

export interface ISubmitSolution {
  completed: boolean;
  result: ITestResult | IJSTestResult;
}
