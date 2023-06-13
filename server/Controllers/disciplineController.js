const ApiError = require('../error/ApiError');
const { Discipline } = require('../models/models');

class DisciplineController {
  async create(req, res, next) {
    const {name, description} = req.body;

    if (!name || !description) {
      return next(ApiError.badRequest('Invalid name or description!'));
    }

    const instance = await Discipline.create({ name, description });

    res.json(instance);
  }

  async getAll(req, res, next) {
    try {
      const instances = await Discipline.findAll();

      res.json(instances);
    } catch (error) {
      next(ApiError.internal(error));
    }
  }

  async delete(req, res, next) {
    const id = Number(req.params.id);
    if (!id || isNaN(id) || id < 0) {
      return next(ApiError.badRequest('Invalid id!'));
    }

    const candidate = await Discipline.findByPk(id);

    if (!candidate) {
      return next(ApiError.notFound('Discipline not found!'));
    }

    await candidate.destroy();

    res.json(candidate);
  }

  async check(id) {
    const candidate = await Discipline.findByPk(id);
    if (!candidate) {
      return false;
    }
    return true;
  }
}

module.exports = new DisciplineController();