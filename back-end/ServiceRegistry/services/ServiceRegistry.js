class ServiceRegistry {
  constructor(log) {
    this.log = log;
    this.services = {};
    this.timeout = 30;
  }

  registry(name, version, ip, port) {
    const key = name + version + ip + port;
    if (!this.services[key]) {
      this.services[key] = {};
      this.services[key].name = name;
      this.services[key].version = version;
      this.services[key].ip = ip;
      this.services[key].port = port;
      this.services[key].timestamp = Math.floor(new Date() / 1000);
      this.log.debug(
        `Added a service ${name} version ${version} at port ${port}`
      );
      return key;
    }

    this.log.debug(
      `updated a service ${name} version ${version} at port ${port}`
    );
    return key;
  }
  unregistry(name, version, ip, port) {
    const key = name + version + ip + port;

    delete this.services[key];
    return key;
  }
}

module.exports = ServiceRegistry;
