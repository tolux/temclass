/* eslint-disable */
import axios from "axios";

class CircuitBreaker {
  constructor() {
    this.states = {};
    this.failureThreshold = 5;
    this.cooldownPeriod = 10;
    this.requestTimeout = 2;
  }

  async callService(reqOptions) {
    const endpoint = `${reqOptions.method}:${reqOptions.url}`;
    if (!this.canRequest(endpoint)) return false;

    reqOptions.timeout = this.requestTimeout * 1000;
    try {
      const response = await axios(reqOptions);
      this.onSucces(endpoint);
      return response.data;
    } catch (error) {
      this.onFailure(endpoint);
      return false;
    }
  }

  onSucces(endpoint) {
    this.initState(endpoint);
  }

  onFailure(endpoint) {
    const state = this.states[endpoint];
    state.failures += 1;
    if (state.failures > this.failureThreshold) {
      state.circuit = "OPEN";
      state.nextTry = new Date() / 1000 + this.cooldownPeriod;
      console.log(`ALERT! Circuit for the ${endpoint} is OPEN`);
    }
  }

  canRequest(endpoint) {
    if (!this.states[endpoint]) this.initState(endpoint);
    const state = this.states[endpoint];
    if (state.circuit === "CLOSED") return true;

    const now = new Date() / 1000;
    if (state.nextTry <= now) {
      state.circuit = "HALF";
      return true;
    }
    return false;
  }

  initState(endpoint) {
    this.states[endpoint] = {
      failures: 0,
      cooldownPeriod: this.cooldownPeriod,
      circuit: "CLOSED",
      nextTry: 0,
    };
  }
}

module.exports = CircuitBreaker;
