const Container = require('../Container');
const tar = require('tar-fs');
const fs = require('fs');
const path = require('path');
const { JS_DATA_PATH } = require('../../constants');
const imageName = 'js-ts-test';

class JSContainer extends Container {
  constructor(docker, number) {
    super(docker);
    this.name = `js-container-${number}`;
    this.dirPath = path.resolve(JS_DATA_PATH, this.name);
    this.codePath = path.resolve(this.dirPath, 'code');
  }
  
  // TODO - Redo method
  createDirs() {
    this._createDirs(JS_DATA_PATH, this.dirPath, this.codePath);
  }

  async createContainer() {
    this._createContainer(imageName, this.dirPath);
  }

  getResult() {
    try {
      const dataJSON = fs.readFileSync(`${this.dirPath}/results.json`);
      const results = JSON.parse(dataJSON);
      const transformedResults = {
        totalDuration: results.stats.duration / 1000,
        totalPassed: results.stats.passes,
        totalFailed: results.stats.failures,
        suites: results.results[0].suites,
      }
      return transformedResults;
    } catch (error) {
      console.log('Файл results.json не найден!');
      const buff = fs.readFileSync(path.resolve(this.dirPath, 'log.txt'));
      return { error: buff.toString() };
    }
  }

  _codeToContainer(code) {
    return new Promise(async (resolve, reject) => {
      fs.writeFileSync(`${this.codePath}/code.js`, code);
      const codeStream = tar.pack(`${this.codePath}`);
      this.container.putArchive(codeStream, {
        path: '/App/',
      }, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve();
        console.log('Код успешно записан!');
      });
    })  
  }

  async _startContainerTest() {
    const exec = await this.container.exec({
      Cmd: ['bash', '-c', 'npm run test'],
      AttachStdout: true,
      AttachStderr: true,
    });
    await this.createOnEndPromise(exec);
  }

  async testCode(code, test) {
    await this.startContainer();
    this.createDirs();
    const codeAndTest = code + '\n' + test;
    await this._codeToContainer(codeAndTest);
    await this._startContainerTest();
    const result = this.getResult();
    this._clearFiles();
    await this.stopContainer();
    return result;
  }
}

module.exports = JSContainer;