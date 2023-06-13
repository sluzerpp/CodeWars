const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { User, Rank } = require('../models/models');

const generateJWT = (id, email, role) => {
  return jsonwebtoken.sign(
    {id: id, email, role}, 
    process.env.SECRET_KEY,
    {expiresIn: '24h'}
  );
}

class UserController {
  async registration(req, res, next) {
    try {
      console.log(req.body);

      const { nickname, email, password, role } = req.body;

      if (!email || !password || !nickname) {
        return next(ApiError.badRequest('Некорректный email, никнейм или пароль!'));
      }
      const candidate = await User.findOne({where: {email}});
      if (candidate) {
        return next(ApiError.badRequest('Пользователь с таким email уже существует!'));
      }

      const hashPassword = await bcrypt.hash(password, 5);
      const user = await User.create({email, nickname, role, password: hashPassword});
      const token = generateJWT(user.id, user.email, user.role);

      return res.json({token});
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({where: {email}});
      if (!user) {
        return next(ApiError.notFound('Пользователь с таким email не найден!'));
      }
      const comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        return next(ApiError.badRequest('Неверный пароль!'));
      }
      const token = generateJWT(user.id, user.email, user.role);

      return res.json({token});
    } catch (error) {
      next(ApiError.internal(error.message));
    }
  }

  async getUserData(req, res, next) {
    try {
      const id = req.user.id;
      const candidate = await User.findByPk(
        id,
        { attributes: ['id', 'nickname', 'email', 'exp', 'role', 'status'] }
      );
      if (!candidate) {
        return next(ApiError.notFound('User not found!'));
      }
      const ranks = await Rank.findAll();
      const filterRanks = ranks.filter((rank) => rank.expFrom <= candidate.exp);
      filterRanks.sort((a, b) => b.expFrom - a.expFrom);
      const rank = filterRanks[0];
      res.json({ ...candidate.dataValues, rank });
    } catch (error) {
      next(ApiError.internal(error));
    }
  }

  async check(req, res, next) {
    const token = generateJWT(req.user.id, req.user.email, req.user.role);
    return res.json({token});
  }

  async delete(req, res, next) {
    const id = Number(req.user.id);
    const user = await User.findByPk(id);
    if (!user) {
      return next(ApiError.notFound('Пользователь не найден!'));
    }
    await user.destroy();
    res.json({message: 'Пользователь успешно удалён!'});
  }

  async update(req, res, next) {
    const user = await User.findByPk(req.user.id);
    const {nickname, oldPassword, newPassword} = req.body;

    const answer = {
      nickname: {
        isChange: false,
        message: '',
      },
      password: {
        isChange: false,
        message: '',
      },
    };

    if (nickname) {
      await user.update({nickname});
      answer.nickname.isChange = true;
    }
    if (oldPassword && newPassword) {
      const comparePassword = bcrypt.compareSync(oldPassword, user.password);
      if (comparePassword) {
        const hashPassword = await bcrypt.hash(newPassword, 5);
        await user.update({password: hashPassword});
        answer.password.isChange = true;
      } else {
        answer.password.message = 'Неверный старый пароль!'
      }
    }
    res.json(answer);
  }
}

const controller = new UserController();

controller.check = controller.check.bind(controller);
controller.registration = controller.registration.bind(controller);
controller.login = controller.login.bind(controller);

module.exports = controller;