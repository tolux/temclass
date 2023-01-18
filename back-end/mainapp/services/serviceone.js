import axios from "axios";

import CircuitBreaker from "../server/lib/CircuitBreaker";

const circuitBreaker = new CircuitBreaker();
class ServiceOne {
  constructor() {}

  async getService(serviceName) {
    const response = await axios.get(
      `https://localhost:4000/find/${serviceName}/1`
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
      url: `https://${ip}:${port}/alldata`,
    });
  }
}

module.exports = ServiceOne;
