import semver from "semver";

class ServiceRegistry {
  constructor(log) {
    this.log = log;
    this.services = {};
    this.timeout = 10;
  }

  get(name, version) {
    this.cleanup();
    const candidates = Object.values(this.services).filter(
      (service) =>
        service.name === name && semver.satisfies(service.version, version)
    );
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  registry(name, version, ip, port) {
    const key = name + version + ip + port;
    this.cleanup();
    if (!this.services[key]) {
      this.services[key] = {};
      this.services[key].name = name;
      this.services[key].version = version;
      this.services[key].ip = ip;
      this.services[key].port = port;
      this.services[key].timestamp = Math.floor(new Date() / 1000);
      this.log.debug(
        `Added a service ${name} version ${version} at port ${port} ip ${ip}`
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
    this.log.debug(
      `unregistry a service ${name} version ${version} at port ${port} ip ${ip}`
    );
    return key;
  }

  cleanup() {
    const now = Math.floor(new Date() / 1000);
    Object.keys(this.services).forEach((key) => {
      if (this.services[key].timestamp + this.timeout < now) {
        delete this.services[key];
        this.log.debug(`service ${key} is removed`);
      }
    });
  }
}

module.exports = ServiceRegistry;
