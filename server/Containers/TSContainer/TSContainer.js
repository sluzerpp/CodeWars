const Container = require('../Container');
const tar = require('tar-fs');
const fs = require('fs');
const path = require('path');
const { TS_DATA_PATH } = require('../../constants');
const imageName = 'js-ts-test';

class TSContainer extends Container {
  constructor(docker, number) {
    super();
    this.docker = docker;
    this.name = `ts-container-${number}`;
    this.dirPath = path.resolve(TS_DATA_PATH, this.name);
    this.codePath = path.resolve(this.dirPath, 'code');
  }
  
  createDirs() {
    this._clearFiles();
    try {
      fs.mkdirSync(TS_DATA_PATH);
    } catch (error) {}
    try {
      fs.mkdirSync(this.dirPath);
    } catch (error) {}
    try {
      fs.mkdirSync(path.resolve(this.codePath));
    } catch (error) {}
  }

  async createContainer() {
    try {
      this.container = await this.docker.createContainer({
        Image: imageName,
        name: this.name,
        Tty: true,
        Cmd: ['/bin/bash'],
        HostConfig: {
          Binds: [`${this.dirPath}:/data`]
        },
      });
      console.log(`Контейнер ${this.name} успешно создан!`)
    } catch (error) {
      this.container = this.docker.getContainer(this.name)
      await this.deleteContainer().finally(async () => {
        await this.createContainer();
      });
      
    }
  }

  getResult() {
    try {
      const buff = fs.readFileSync(path.resolve(this.dirPath, 'tslog.txt'));
      if (buff.toString()) {
        return { error: buff.toString() }
      } else {
        throw 'tslog.txt пуст!';
      }
    } catch (error) {
      try {
        const dataJSON = fs.readFileSync(`${this.dirPath}/results.json`);
        const results = JSON.parse(dataJSON);
        const refactorResults = {
          totalDuration: results.stats.duration / 1000,
          totalPassed: results.stats.passes,
          totalFailed: results.stats.failures,
          suites: results.results[0].suites,
        }
        return refactorResults;
      } catch (error) {
        console.log('Файл results.json не найден!');
        const buff = fs.readFileSync(path.resolve(this.dirPath, 'log.txt'));
        return { error: buff.toString() };
      }
    }
  }

  _codeToContainer(code) {
    return new Promise(async (resolve, reject) => {
      fs.writeFileSync(`${this.codePath}/code.ts`, code);
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

  _testToContainer(test) {
    return new Promise(async (resolve, reject) => {
      fs.writeFileSync(`${this.codePath}/test.ts`, test);
      const testStream = tar.pack(`${this.codePath}`);
      this.container.putArchive(testStream, {
        path: '/App/',
      }, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve();
        console.log('Тесты успешно записаны!');
      });
    })  
  }

  async _buildContainerTest() {
    const exec = await this.container.exec({
      Cmd: ['bash', '-c', 'npm run build'],
      AttachStdout: true,
      AttachStderr: true,
    });
    await this.createOnEndPromise(exec);
  }

  async _startContainerTest() {
    const exec = await this.container.exec({
      Cmd: ['bash', '-c', 'npm run test'],
      AttachStdout: true,
      AttachStderr: true,
    });
    await this.createOnEndPromise(exec);
  }

  _clearFiles() {
    try {
      if (fs.existsSync(this.dirPath)) {
        fs.rmSync(this.dirPath, { recursive: true });
      }
    } catch (error) {
      return this._clearFiles();
    }
    console.log(`Директория ${this.name} успешно очищена!`);
  }

  async testCode(code, test) {
    await this.startContainer();
    this.createDirs();
    await this._codeToContainer(code);
    await this._testToContainer(test);
    await this._buildContainerTest();
    await this._startContainerTest();
    const result = this.getResult();
    this._clearFiles();
    await this.stopContainer();
    return result;
  }
}

module.exports = TSContainer;