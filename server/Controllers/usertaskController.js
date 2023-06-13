const { USERTASK_STATE, TASK_STATE } = require('../constants');
const ApiError = require('../error/ApiError');
const { UserTask, Task, User, Solution, Code, Rank, Discipline } = require('../models/models');
const langController = require('./langController');
const runController = require('./runController');
const solutionController = require('./solutionController');

class UserTaskController {
  
  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const { taskId } = req.body;
      if (!taskId || taskId < 0) {
        return next(ApiError.badRequest('Invalid taskId'));
      }
      const instance = await UserTask.findCreateFind({ userId, taskId });
      res.json(instance);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }

  async getUserTasks(req, res, next) {
    const userId = req.user.id;
    let { page, limit } = req.query;
    if (!page || page < 0) {
      page = 1;
    }
    if (!limit || limit < 0) {
      limit = 10;
    }
    const offset = (page - 1) * 10;
    
    const instances = 
      await Task.findAll({ limit, offset, where: { state: TASK_STATE.Available }, include: [
        { model: Rank },
        { model: Discipline }
      ]});
    
    const instancesWithUser = await Promise.all(instances.map(async(instance) => {
      let userTask = await UserTask.findOne({ where: { taskId: instance.id, userId } });
    
      if (!userTask) {
        userTask = { state: 'AVAILABLE' }
      }


      
      return { ...instance.dataValues, userTask };
    }));

    res.json(instancesWithUser);
  }

  async getOneUserTask(req, res, next) {
    const userId = req.user.id;
    const taskId= Number(req.params.id)
    if (isNaN(taskId) || taskId < 0) {
      return next(ApiError.badRequest('Invalid taskId!'));
    }
    const { lang } = req.body;
    if (!lang || langController.check(lang)) {
      return next(ApiError.badRequest('Invalid lang!'));
    }
    const instance = 
      await Task.findOne({ where: { id: taskId }, include: [
        { model: Rank },
        { model: Discipline }
      ] });

    let userTask = await UserTask.findOne({ where: { taskId, userId } });
    
    if (!userTask) {
      userTask = { state: 'AVAILABLE' }
    }

    const solution = await Solution.findOne({ where: { userId, taskId, lang } });

    res.json({ ...instance, solution  });
  }

  async updateState(req, res, next) {
    try {
      const userId = req.user.id;
      const taskId= Number(req.params.id)
      if (isNaN(taskId) || taskId < 0) {
        return next(ApiError.badRequest('Invalid taskId!'));
      }
      const { code, lang } = req.body;
      if (!lang || !langController.check(lang)) {
        return next(ApiError.badRequest('Invalid lang!'));
      }
      if (!code) {
        return next(ApiError.badRequest('Invalid code or test!'));
      }
      let instance = await UserTask.findOne({ where: { userId, taskId } });
      if (!instance) {
        instance = await UserTask.create({ userId, taskId });
      }
      const test = await Code.findOne({ where: { lang, taskId } });
      if (!test) {
        return next(ApiError.notFound('Test for this language not found!'));
      }
      const result = await runController.runByLang(lang, code, test.test);
      if (result.totalFailed > 0) {
        return res.json({ result, completed: false })
      }
      await instance.update({ state: USERTASK_STATE.Completed })
      await solutionController.create(code, lang, taskId, userId);
      return res.json({ result, completed: true })
    } catch (error) {
      console.error(error);
      return next(ApiError.internal(error.message));
    }
  }

  check(state) {
    const values = Object.values(USERTASK_STATE);
    return values.includes(state.toUpperCase());
  }
}

module.exports = new UserTaskController();