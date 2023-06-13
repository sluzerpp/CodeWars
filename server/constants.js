const path = require('path');
const bcrypt = require('bcrypt');

const DATA_DIRECTORY = path.resolve(__dirname, 'tempData');
const JAVA_DATA_PATH = path.resolve(DATA_DIRECTORY, 'JavaData');
const JS_DATA_PATH = path.resolve(DATA_DIRECTORY, 'JSData');
const TS_DATA_PATH = path.resolve(DATA_DIRECTORY, 'TSData');
const CSHARP_DATA_PATH = path.resolve(DATA_DIRECTORY, 'CSharpData');

const USER_STATUES = {
  Available: 'AVAILABLE',
  Restricted: 'RESTRICTED',
  Blocked: 'BLOCKED',
}

const USER_ROLES = {
  User: 'USER',
  Moderator: 'MODERATOR',
  Admin: 'ADMIN',
}

const USER_RATES = {
  Up: 1,
  Down: -1,
  Empty: 0,
}

const ADMIN_DEFAULT = {
  nickname: 'Sluzer',
  email: 'bistboy.es@gmail.com',
  password: bcrypt.hashSync('123qwe', 5),
  role: 'ADMIN',
}

const TASK_SATISFACTIONS = {
  Very: 'VERY',
  Somewhat: 'SOMEWHAT',
  None: 'NONE',
}

const TASK_STATE = {
  Moderation: 'MODERATION',
  Available: 'AVAILABLE',
}

const USERTASK_STATE = {
  Solved: 'SOLVED',
  Completed: 'COMPLETED',
}

const LANGUAGES = {
  js: 'JAVASCRIPT',
  ts: 'TYPESCRIPT',
  cs: 'CSHARP',
  java: 'JAVA',
}

const MAX_CONTAINERS_COUNT = 1;

module.exports = {
  JAVA_DATA_PATH,
  JS_DATA_PATH,
  TS_DATA_PATH,
  CSHARP_DATA_PATH,
  ADMIN_DEFAULT,
  USER_STATUES,
  USER_ROLES,
  USER_RATES,
  TASK_SATISFACTIONS,
  MAX_CONTAINERS_COUNT,
  TASK_STATE,
  USERTASK_STATE,
  LANGUAGES
}