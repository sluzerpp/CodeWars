const { USER_STATUES, USER_ROLES, USER_RATES, TASK_SATISFACTIONS, TASK_STATE, USERTASK_STATE } = require('../constants');
const sequelize = require('../db');
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  nickname: {type: DataTypes.STRING, unique: true},
  email: {type: DataTypes.STRING, unique: true},
  password: {type: DataTypes.STRING},
  role: {type: DataTypes.STRING, defaultValue: USER_ROLES.User},
  exp: {type: DataTypes.INTEGER, defaultValue: 0},
  status: {type: DataTypes.STRING, defaultValue: USER_STATUES.Available},
});

const UserTask = sequelize.define('userTask', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  state: {type: DataTypes.STRING}
})

const Task = sequelize.define('task', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, defaultValue: ''},
  description: {type: DataTypes.STRING, defaultValue: ''},
  tags: {type: DataTypes.STRING, defaultValue: ''},
  state: {type: DataTypes.STRING, defaultValue: TASK_STATE.Moderation}
});

const TaskFavorite = sequelize.define('taskFavorite', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

const TaskSatisfaction = sequelize.define('taskSatisfaction', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  rating: {type: DataTypes.STRING, defaultValue: TASK_SATISFACTIONS.None}
});

const Discourse = sequelize.define('discourse', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  description: {type: DataTypes.STRING, defaultValue: ''},
  type: {type: DataTypes.STRING, defaultValue: ''}
});

const DiscourseRate = sequelize.define('discourseRate', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  rating: {type: DataTypes.INTEGER, defaultValue: USER_RATES.Empty},
});

const Rank = sequelize.define('rank', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, defaultValue: ''},
  number: {type: DataTypes.INTEGER, defaultValue: ''},
  expFrom: {type: DataTypes.INTEGER, defaultValue: 0},
  expReward: {type: DataTypes.INTEGER, defaultValue: 0},
  colorName: {type: DataTypes.STRING, defaultValue: 'Unknown'},
  colorHEX: {type: DataTypes.STRING, defaultValue: '#ffffff'}
});

const Discipline = sequelize.define('discipline', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, defaultValue: '', unique: true},
  description: {type: DataTypes.STRING, defaultValue: ''},
});

const Code = sequelize.define('code', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  solution: {type: DataTypes.STRING},
  test: {type: DataTypes.STRING, allowNull: false}, 
  template: {type: DataTypes.STRING, allowNull: false},
  lang: {type: DataTypes.STRING}
});

const Solution = sequelize.define('solution', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  code: {type: DataTypes.STRING, allowNull: false},
  lang: {type: DataTypes.STRING}
});

const SolutionBestPractice = sequelize.define('solutionBestPractice', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const SolutionClever = sequelize.define('solutionClever', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Collection = sequelize.define('collection', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, defaultValue: '', unique: true},
});

const CollectionTask = sequelize.define('collectionTask', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

const UserCollection = sequelize.define('userCollection', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

const CollectionRate = sequelize.define('collectionRate', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  rating: {type: DataTypes.INTEGER, defaultValue: USER_RATES.Empty},
});

Task.belongsTo(Discipline);
Discipline.hasMany(Task);

Task.belongsTo(Rank);
Rank.hasMany(Task);

User.belongsToMany(Task, { through: UserTask });
Task.belongsToMany(User, { through: UserTask });

User.belongsToMany(Task, { through: TaskFavorite });
Task.belongsToMany(User, { through: TaskFavorite });

User.belongsToMany(Task, { through: TaskSatisfaction });
Task.belongsToMany(User, { through: TaskSatisfaction });

Task.hasOne(Code, {
  onDelete: 'CASCADE'
});
Code.belongsTo(Task);

Task.hasMany(Solution, {
  onDelete: 'CASCADE'
});
Solution.belongsTo(Task);

User.hasMany(Solution);
Solution.belongsTo(User);

Solution.belongsToMany(User, { through: SolutionBestPractice });
User.belongsToMany(Solution, { through: SolutionBestPractice });

Solution.belongsToMany(User, { through: SolutionClever });
User.belongsToMany(Solution, { through: SolutionClever });

Task.hasMany(Discourse, {
  onDelete: 'CASCADE'
});
Discourse.belongsTo(Task);

Discourse.belongsToMany(User, { through: DiscourseRate });
User.belongsToMany(Discourse, { through: DiscourseRate });

User.hasMany(Collection);
Collection.belongsTo(User);

Collection.belongsToMany(User, { through: UserCollection });
User.belongsToMany(Collection, { through: UserCollection });

Collection.belongsToMany(User, { through: CollectionRate });
User.belongsToMany(Collection, { through: CollectionRate });

Task.belongsToMany(Collection, { through: CollectionTask });
Collection.belongsToMany(Task, { through: CollectionTask });

module.exports = {
  User,
  UserTask,
  Discipline,
  Discourse,
  Collection,
  Solution,
  Task,
  TaskFavorite,
  TaskSatisfaction,
  DiscourseRate,
  Rank,
  Code,
  SolutionBestPractice,
  SolutionClever,
  CollectionTask,
  CollectionRate,
  UserCollection
}