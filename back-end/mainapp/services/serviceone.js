import axios from "axios";

import CircuitBreaker from "../server/lib/CircuitBreaker";

const circuitBreaker = new CircuitBreaker();
class ServiceOne {
  constructor(config) {
    this.config = config;
  }
  async getService(serviceName) {
    const response = await axios.get(
      `${this.config.serviceRegistryUrl}/find/${serviceName}/${this.config.serviceVersionIdentifier}`
    );
    return response.data;
  }

  async callService(reqOptions) {
    return circuitBreaker.callService(reqOptions);
  }

  async getData() {
    const { ip, port } = this.getService("service-one");

    return this.callService({
      method: "get",
      url: `http://${ip}:${port}/alldata`,
    });
  }
}

module.exports = ServiceOne;
