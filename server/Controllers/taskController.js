const { TASK_STATE } = require('../constants');
const ApiError = require('../error/ApiError');
const { Task, Code, Rank, Discipline } = require('../models/models');

class TaskController {
  async createOrUpdate(req, res, next) {
    const {
      taskId,
      name,
      description, 
      tags,
      disciplineId,
      rankId,
    } = req.body;
    if (!name || !description) {
      return next(ApiError.badRequest('Invalid name or description!'));
    }
    if (!tags) {
      return next(ApiError.badRequest('Invalid tags!'));
    }
    if (!disciplineId || !rankId) {
      return next(ApiError.badRequest('Invalid disciplineId or rankId'));
    }
    const tagsLowerCase = tags.split(',').map((tag) => tag.trim().toLowerCase()).join(',');
    
    if (taskId) {
      const candidate = await Task.findByPk(taskId);
      if (candidate) {
        await candidate.update({ name, description, tags: tagsLowerCase, disciplineId, rankId, state: TASK_STATE.Available })
        const task = await Task.findByPk(candidate.id, { include: [
          { model: Rank },
          { model: Discipline }
        ]});
        return res.json(task);
      }
    }

    const instance = await Task.create({ name, description, tags: tagsLowerCase, disciplineId, rankId, state: TASK_STATE.Available });
    const task = await Task.findByPk(instance.id, { include: [
      { model: Rank },
      { model: Discipline }
    ]});

    res.json(task);
  }

  async updateState(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 0) {
      return next(ApiError.badRequest('Invalid id!'));
    }

    const { state } = req.body;
    if (!state || !this.check(state)) {
      return next(ApiError.badRequest('Invalid state!'));
    }

    const candidate = await Task.findByPk(id);
    if(!candidate) {
      return next(ApiError.notFound('Task not found!'));
    }

    await candidate.update({ state });

    res.json(candidate);
  }

  async getAll(req, res, next) {
    let { page, limit } = req.query;
    console.log(page, limit)
    if (!page || page < 0) {
      page = 1;
    }
    if (!limit || limit < 0) {
      limit = 10;
    }
    const offset = (page - 1) * 10; 
    const instances = await Task.findAll({ limit, offset, include: [
      { model: Rank },
      { model: Discipline }
    ] })

    res.json(instances);
  }

  async getOne(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 0) {
      return next(ApiError.badRequest('Invalid id!'));
    }

    const candidate = await Task.findByPk(id, { include: [
      { model: Rank },
      { model: Discipline }
    ]});
    if (!candidate) {
      return next(ApiError.notFound('Task not found!'));
    }

    res.json(candidate);
  }

  async delete(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 0) {
      return next(ApiError.badRequest('Invalid id'));
    }

    const candidate = await Task.findByPk(id);

    if (!candidate) {
      return next(ApiError.notFound('Task not found!'));
    }

    await candidate.destroy();

    res.json(candidate);
  }

  async check(state) {
    const values = Object.values(TASK_STATE);
    return values.includes(state.toUpperCase());
  }
}

const controller = new TaskController();

controller.check = controller.check.bind(controller);
controller.updateState = controller.updateState.bind(controller);

module.exports = controller;