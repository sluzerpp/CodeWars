const fs = require('fs');

class Container {
  constructor(docker) {
    this.docker = docker;
  }

  async _createContainer(imageName, dataPath) {
    try {
      await this.docker.info();
    } catch (error) {
      return;
    }
    try {
      this.container = await this.docker.createContainer({
        Image: imageName,
        name: this.name,
        Tty: true,
        Cmd: ['/bin/bash'],
        HostConfig: {
          Binds: [`${dataPath}:/data`]
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

  _createDirs(...paths) {
    this._clearFiles();
    paths.forEach((path) => {
      try {
        fs.mkdirSync(path);
      } catch (error) {}
    });
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

  async startContainer() {
    await this.container.start();
    console.log('Контейнер успешно запущен!');
  }

  async stopContainer() {
    await this.container.stop();
    console.log('Контейнер успешно остановлен!');
  }

  async deleteContainer() {
    try {
      this._clearFiles();
      await this.stopContainer().then(async () => {
        await this.container.remove();
        console.log('Контейнер успешно удалён');
      }).catch(async () => {
        await this.container.remove();
        console.log('Контейнер успешно удалён');
      });
    } catch (error) {
      console.log('удаление - ', error)
    }
  }
  

  async createOnEndPromise(exec) {
    await new Promise((resolve, reject) => {
      exec.start((err, stream) => {
        if (err) return reject(err);
        this.docker.getContainer(this.name).modem.demuxStream(stream, process.stdout, process.stderr);
        stream.on('end', () => {
          console.log('Command execution finished');
          resolve();
        });
      });
    });
  }
}

module.exports = Container;