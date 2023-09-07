const ApiError = require('../error/ApiError');
const { Solution } = require('../models/models');
const langController = require('./langController');

class SolutionController {
  async create(code, lang, taskId, userId) {
    const candidate = await Solution.findOne({ where: { lang, taskId, userId } });
    if (candidate) {
      await candidate.update({ code });
      return;
    }
    await Solution.create({ code, lang, taskId, userId });
  }

  async getAll(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 0) {
      return next(ApiError.badRequest('Invalid id!'));
    }
    const { lang } = req.body;
    if (!lang || !langController.check(lang)) {
      return next(ApiError.badRequest('Invalid lang!'));
    }
    const instances = await Solution.findAll({ where: { taskId: id, lang } });

    res.json(instances);
  }

  async getUserSolution(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 0) {
      return next(ApiError.badRequest('Invalid id!'));
    }
    const { lang } = req.body;
    if (!lang || !langController.check(lang)) {
      return next(ApiError.badRequest('Invalid lang!'));
    }
    const instance = await Solution.findOne({ where: { taskId: id, lang, userId: req.user.id } });
    if (!instance) {
      return next(ApiError.notFound('Solution not found!'));
    }
    res.json(instance);
  }
}

module.exports = new SolutionController();