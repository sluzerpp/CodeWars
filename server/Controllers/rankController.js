const ApiError = require('../error/ApiError');
const { Rank } = require('../models/models');

class RankController {
  async create(req, res, next) {
    const { name, number, expFrom, expReward, colorName, colorHEX } = req.body;
    if (!name || !number) {
      return next(ApiError.badRequest('Invalid name or number!'));
    }
    if (expFrom === undefined || !expReward) {
      return next(ApiError.badRequest('Invalid expFrom or expReward!'));
    }
    if (!colorName || !colorHEX) {
      return next(ApiError.badRequest('Invalid colorname or colorHEX!'));
    }

    const instance = await Rank.create({ name, number, expFrom, expReward, colorName, colorHEX });

    res.json(instance);
  }

  async getAll(req, res, next) {
    const instances = await Rank.findAll();
    res.json(instances);
  }

  async delete(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 0) {
      return next(ApiError.badRequest('Invalid id!'));
    }
    const candidate = await Rank.findByPk(id);
    if (!candidate) {
      return next(ApiError.notFound('Rank not found!'));
    }
    await candidate.destroy();
    res.json(candidate);
  }
}

module.exports = new RankController();