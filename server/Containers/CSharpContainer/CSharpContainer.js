const Container = require('../Container');
const tar = require('tar-fs');
const fs = require('fs');
const path = require('path');
const imageName = 'csharp-test-with-xml';
const { XMLParser } = require("fast-xml-parser");
const { CSHARP_DATA_PATH } = require('../../constants');

class CSharpContainer extends Container {
  constructor(docker, number) {
    super(docker);
    this.name = `csharp-container-${number}`;
    this.dirPath = path.resolve(CSHARP_DATA_PATH, this.name);
    this.codePath = path.resolve(this.dirPath, 'code');
    this.testPath = path.resolve(this.dirPath, 'test');
    this.dataPath = path.resolve(this.dirPath, 'data');
  }
  
  // TODO - Redo method
  createDirs() {
    this._createDirs(CSHARP_DATA_PATH, this.dirPath, this.codePath, this.testPath, this.dataPath);
  }

  async createContainer() {
    this._createContainer(imageName, this.dataPath);
  }

  async getResult() {
    try {
      return this._resultToJSON();
    } catch (error) {
      console.log('Файл results.xml не найден!');
      const buff = fs.readFileSync(path.resolve(this.dataPath, 'log.txt'));
      return { error: buff.toString() };
    }
  }

  _codeToContainer(code) {
    return new Promise(async (resolve, reject) => {
      fs.writeFileSync(`${this.codePath}/Code.cs`, code);
      const codeStream = tar.pack(`${this.codePath}`);
      this.container.putArchive(codeStream, {
        path: '/App/Code',
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
      fs.writeFileSync(`${this.testPath}/Test.cs`, test);
      const testStream = tar.pack(`${this.testPath}`);
      this.container.putArchive(testStream, {
        path: '/App/App.Tests'
      }, (err, res) => {
        if (err) {
          return reject(err);
        }
        resolve()
        console.log('Тесты успешно записаны!');
      })
    });
  }

  async _startContainerTest() {
    const exec = await this.container.exec({
      Cmd: ['bash', '-c', 'dotnet test --logger:"nunit;LogFilePath=/data/results.xml" > /data/log.txt'],
      AttachStdout: true,
      AttachStderr: true,
    });
    await this.createOnEndPromise(exec);
  }

  _parseTestResult(json) {
    if ('test-suite' in json) {
      const suite = this._parseTestResult(json['test-suite']);
      if (suite instanceof Array) {
        return suite.reduce((a, b) => [...a, this._parseTestResult(b)] , []).flat(Infinity);
      }
      return this._parseTestResult(suite);
    }
    if ('test-case' in json) {
      const testCase = json['test-case'];
      return testCase;
    }
    return json;
  }

  _transformTestCase(testCase) {
    const newTestCase = {
      name: testCase.methodname,
      classname: testCase.classname,
      time: testCase.duration,
      result: testCase.result,
    }
    if ('failure' in testCase) {
      newTestCase.failure = testCase.failure.message;
    }
    return newTestCase;
  }

  _resultToJSON() {
    const options = {
      ignoreAttributes : false,
      attributeNamePrefix : ""
    };
    const XMLdata = fs.readFileSync(`${this.dataPath}/results.xml`);
    const parser = new XMLParser(options);
    const xmlJson = parser.parse(XMLdata, true)['test-run'];
    const testCases = this._parseTestResult(xmlJson).map(
      (testCase) => this._transformTestCase(testCase)
    );
    const resultJSON = {
      totalDuration: xmlJson.duration,
      totalPassed: Number(xmlJson.passed),
      totalFailed: Number(xmlJson.failed),
      testCases,
    }
    return resultJSON;
  }

  async testCode(code, test) {
    await this.startContainer();
    this.createDirs();
    await this._codeToContainer(code);
    await this._testToContainer(test);
    await this._startContainerTest();
    const result = await this.getResult();
    this._clearFiles();
    await this.stopContainer();
    return result;
  }
}

module.exports = CSharpContainer;