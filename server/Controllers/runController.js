const Dockerode = require('dockerode');
const ContainerController = require('../ContainerControllers/ContainerController');
const JSContainer = require('../Containers/JSContainer/JSContainer');
const TSContainer = require('../Containers/TSContainer/TSContainer');
const CSharpContainer = require('../Containers/CSharpContainer/CSharpContainer');
const JavaContainer = require('../Containers/JavaContainer/JavaContainer');
const ApiError = require('../error/ApiError');
const { LANGUAGES } = require('../constants');

class RunController {
  constructor() {
    this.docker = new Dockerode();
    this.javascript = new ContainerController(this.docker, JSContainer)
    this.typescript = new ContainerController(this.docker, TSContainer)
    this.csharp = new ContainerController(this.docker, CSharpContainer)
    this.java = new ContainerController(this.docker, JavaContainer)
    this.javascript.initContainers();
    this.typescript.initContainers();
    this.csharp.initContainers();
    this.java.initContainers();
    this.runJS = this._runLang(this.javascript);
    this.runTS = this._runLang(this.typescript);
    this.runCS = this._runLang(this.csharp);
    this.runJAVA = this._runLang(this.java);
  }

  _runLang(controller) {
    return async (req, res, next) => {
      const { code, test } = req.body;
      if (!code || !test) {
        return next(ApiError.badRequest('Invalid code or test!'));
      }
      const result = await controller.testCode(code, test)
      res.json(result);
    }
  }

  async runByLang(lang, code, test) {
    switch (lang) {
      case LANGUAGES.java: {
        return await this.java.testCode(code, test);
      }
      case LANGUAGES.cs: {
        return await this.csharp.testCode(code, test);
      }
      case LANGUAGES.js: {
        return await this.javascript.testCode(code, test);
      }
      case LANGUAGES.ts: {
        return await this.typescript.testCode(code, test);
      }
    }
  }
}

module.exports = new RunController();