const { MAX_CONTAINERS_COUNT } = require('../constants');

class ContainerController {
  constructor(docker, ContainerClass) {
    this.freeContainers = [];
    this.busyContainers = [];
    this.ContainerClass = ContainerClass;
    this.docker = docker;
  }

  async initContainers() {
    for (let i = 0; i < MAX_CONTAINERS_COUNT; i += 1) {
      this.freeContainers.push(new this.ContainerClass(this.docker, i));
    }
    for (let i = 0; i < MAX_CONTAINERS_COUNT; i += 1) {
      await this.freeContainers[i].createContainer();
    }
  }

  async testCode(code, test) {
    try {
      const getFreeContainer = async () => {
        while (true) {
          if (this.freeContainers.length > 0) {
            return this.freeContainers[0];
          }
          console.log('Ожидание свободного контейнера!')
          await new Promise((res, rej) => {
            setTimeout(() => {
              res();
            }, 1000)
          });
        }
      }

      const container = await getFreeContainer();
      this._useContainer(container);
      const result = await container.testCode(code, test);
      console.log(result);
      this._freeContainer(container);
      return result;
    } catch (error) {
      console.error(error);
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(this.testCode(code, test));
        })
      }, 1000);
    }
  }  

  _useContainer(container) {
    this.freeContainers = this.freeContainers.filter((cont) => cont.name !== container.name);
    this.busyContainers.push(container);
  }

  _freeContainer(container) {
    this.busyContainers = this.busyContainers.filter((cont) => cont.name !== container.name);
    this.freeContainers.push(container);
  }
}

module.exports = ContainerController;