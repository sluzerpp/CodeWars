const ApiError = require('../error/ApiError');
const { Code, Solution } = require('../models/models');
const langController = require('./langController');

class CodeController {
  async createOrUpdate(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id < 0) {
        return next(ApiError.badRequest('Invalid id!'));
      }
      const { template, test, lang, solution } = req.body;
      if (!template || !test || !solution) {
        return next(ApiError.badRequest('Invalid template or test or solution!'));
      }
      if (!lang || !langController.check(lang)) {
        return next(ApiError.badRequest('Invalid lang!'));
      }

      const candidate = await Code.findOne({ where: { lang, taskId: id } });
      if (candidate) {
        await candidate.update({ template, test, lang, solution });
        return res.json(candidate);
      }

      const instance = await Code.create({ template, test, lang, solution, taskId: id });

      res.json(instance);
    } catch (error) {
      next(ApiError.internal(error.message));
    }
  }

  async getTaskLangs(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 0) {
      return next(ApiError.badRequest('Invalid id!'));
    }
    const codes = await Code.findAll({ where: { taskId: id } });
    const langs = codes.map((code) => code.lang);
    res.json(langs);
  }

  async getOne(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 0) {
      return next(ApiError.badRequest('Invalid id!'));
    }
    const { lang } = req.body;
    if (!lang || !langController.check(lang)) {
      return next(ApiError.badRequest('Invalid lang!'));
    }
    const instance = await Code.findOne({ where: { lang, taskId: id } });
    if (!instance) {
      return next(ApiError.notFound('Code not found!')); 
    }
    res.json(instance);
  }

  async delete(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 0) {
      return next(ApiError.badRequest('Invalid id!'));
    }
    const { lang } = req.query;
    if (!lang || !langController.check(lang)) {
      return next(ApiError.badRequest('Invalid lang!'));
    }
    const instance = await Code.findOne({ where: { lang, taskId: id } });
    if (!instance) {
      return next(ApiError.notFound('Code not found!')); 
    }
    await Solution.destroy({where: { taskId: id, lang }});
    await instance.destroy();
    res.json(instance);
  }
}

module.exports = new CodeController();