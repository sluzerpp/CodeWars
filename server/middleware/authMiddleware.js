const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

module.exports = function(roles = []) {
  return async function (req, res, next) {
    if (req.method == 'OPTIONS') {
      next();
    }
    try {
      const token = req.headers.authorization.split(' ')[1] // Bearer eq4q23qe32...
      if (!token) {
        return res.status(401).json({message: 'Не авторизован!' });
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (roles.length !== 0 && !roles.includes(decoded.role.toUpperCase())) {
        return res.status(403).json({message: 'Нет доступа!'})
      }
      const candidate = await User.findByPk(decoded.id);
      if (!candidate) {
        return res.status(404).json({message: 'Пользователь не найден!'});
      }
      req.user = decoded;
      req.user.role = candidate.role;
      next();
    } catch (e) {
      res.status(401).json({message: 'Не авторизован!' });
    }
  }
}