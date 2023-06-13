const Container = require('../Container');
const tar = require('tar-fs');
const fs = require('fs');
const path = require('path');
const imageName = 'java-test';
const { XMLParser } = require("fast-xml-parser");
const { JAVA_DATA_PATH } = require('../../constants');

class JavaContainer extends Container {
  constructor(docker, number) {
    super();
    this.docker = docker;
    this.name = `java-container-${number}`;
    this.dirPath = path.resolve(JAVA_DATA_PATH, this.name);
    this.codePath = path.resolve(this.dirPath, 'code');
    this.testPath = path.resolve(this.dirPath, 'test');
    this.dataPath = path.resolve(this.dirPath, 'data');
  }
  
  createDirs() {
    this._clearFiles();
    try {
      fs.mkdirSync(JAVA_DATA_PATH);
    } catch (error) {}
    try {
      fs.mkdirSync(this.dirPath);
    } catch (error) {}
    try {
      fs.mkdirSync(path.resolve(this.codePath));
    } catch (error) {}
    try {
      fs.mkdirSync(path.resolve(this.testPath));
    } catch (error) {}
    try {
      fs.mkdirSync(path.resolve(this.dataPath));
    } catch (error) {}
  }

  async _renameXML(className) {
    const exec = await this.container.exec({
      Cmd: ['bash', '-c', `mv /data/TEST-${className}.xml /data/results.xml`],
      AttachStdout: true,
      AttachStderr: true,
    });
    try {
      await this.createOnEndPromise(exec);
      console.log('Файл переименован!')
    } catch (error) {
      console.log('Файл не был переименован!')
    }
  }

  async createContainer() {
    try {
      this.container = await this.docker.createContainer({
        Image: imageName,
        name: this.name,
        Tty: true,
        Cmd: ['/bin/bash'],
        HostConfig: {
          Binds: [`${this.dataPath}:/data`]
        },
      });
      console.log('Контейнер успешно создан!')
    } catch (error) {
      this.container = this.docker.getContainer(this.name)
      await this.deleteContainer();
      await this.createContainer();
    }
  }

  

  _getCodeClassName(code) {
    try {
      const regex = /class\s+(\w+)/;
      const match = code.match(regex);
      const className = match[1];
      return className;
    } catch (error) {
      return null;
    }
  }

  getResult() {
    try {
      return this._resultToJSON();
    } catch (error) {
      const buff = fs.readFileSync(path.resolve(this.dataPath, 'log.txt'));
      return {
        error: buff.toString(),
      }
    }
  }

  _parseTestResult(json) {
    if ('testsuite' in json) {
      return json['testsuite'];
    }
    if ('testcase' in json) {
      const testCase = json['testcase'];
      if (testCase instanceof Array) {
        return testCase;
      }
      return [testCase];
    }
    return json;
  }

  _transformTestCase(testCase) {
    const newTestCase = {
      ...testCase,
      result: 'Passed',
    };
    if ('failure' in testCase) {
      newTestCase.failure = testCase.failure['#text'];
      newTestCase.result = 'Failed';
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
    const xmlJson = parser.parse(XMLdata, true)['testsuite'];
    const testCases = this._parseTestResult(xmlJson).map(
      (testCase) => this._transformTestCase(testCase)
    );
    const resultJSON = {
      totalDuration: xmlJson.time,
      totalPassed: xmlJson.tests - xmlJson.failures,
      totalFailed: Number(xmlJson.failures),
      testCases,
    }
    return resultJSON;
  }

  _codeToContainer(code, className) {
    return new Promise(async (resolve, reject) => {
      const codeWithPackage = 'package org.code;\n' + code;
      fs.writeFileSync(`${this.codePath}/${className}.java`, codeWithPackage);
      const codeStream = tar.pack(`${this.codePath}`);
      this.container.putArchive(codeStream, {
        path: 'App/src/main/java/org/code/',
      }, (err, response) => {
        if (err) {
          return reject(err);
        }
        resolve();
        console.log('Код успешно записан!');
      });
    })  
  }

  _testToContainer(test, className) {
    return new Promise(async (resolve, reject) => {
      const testWithClassImport = `import org.code.${className};\n` + test;
      fs.writeFileSync(`${this.testPath}/Tests.java`, testWithClassImport);
      const testStream = tar.pack(`${this.testPath}`);
      this.container.putArchive(testStream, {
        path: '/App/src/test/java'
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
      Cmd: ['bash', '-c', 'mvn test 2>&1 > /data/log.txt'],
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
    const className = this._getCodeClassName(code);
    const testClassName = this._getCodeClassName(test);
    if (!className || !testClassName) {
      this._clearFiles();
      await this.stopContainer();
      return { error: 'Missing classname!' };
    }
    await this._codeToContainer(code, className);
    await this._testToContainer(test, className);
    await this._startContainerTest();
    await this._renameXML(testClassName);
    const result = this.getResult();
    this._clearFiles();
    await this.stopContainer();
    return result;
  }
}

module.exports = JavaContainer;