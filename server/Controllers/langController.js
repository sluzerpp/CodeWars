const { LANGUAGES } = require('../constants');

class LangController {
  getAll(req, res, next) {
    res.json(Object.values(LANGUAGES));
  }

  check(lang) {
    const values = Object.values(LANGUAGES);
    return values.includes(lang.toUpperCase());
  }
}

module.exports = new LangController();