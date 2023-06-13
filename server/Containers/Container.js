class Container {
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
    } catch (error) {}
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