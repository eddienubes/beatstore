const axios = require('axios');
const url = require('url');

module.exports = class BeatstoreService {
  baseBeatsUrl = `${process.env.BACKEND_URL}/api/beats`;

  baseLicensesUrl = `${process.env.BACKEND_URL}/api/licenses`;

  baseOrderUrl = `${process.env.BACKEND_URL}/api/orders`;

  baseUsersUrl = `${process.env.BACKEND_URL}/api/users`;

  baseBotsUrl = `${process.env.BACKEND_URL}/api/bots`;

  async getAllBeats(skip, limit) {
    const requestUrl = new url.URL(this.baseBeatsUrl);
    requestUrl.searchParams.append('skip', skip.toString());
    requestUrl.searchParams.append('limit', limit.toString());

    return axios.get(requestUrl.href);
  }

  async getBeatById(id) {
    const requestUrl = new url.URL(`${this.baseBeatsUrl}/${id}`);
    return axios.get(requestUrl.href);
  }

  async updateBeatById(id, data, headers) {
    const requestUrl = new url.URL(`${this.baseBeatsUrl}/${id}`);
    return axios.patch(requestUrl.href, data, {
      headers: {
        ...headers,
        Authorization: `Bearer ${process.env.TOKEN} ID: ${process.env.BOT_ID}`
      }
    });
  }

  async deleteBeaById(id) {
    const requestUrl = new url.URL(`${this.baseBeatsUrl}/${id}`);
    return axios.delete(requestUrl.href, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN} ID: ${process.env.BOT_ID}`
      }
    });
  }

  async createNewBeat(data, headers) {
    return axios.post(this.baseBeatsUrl, data, {
      headers: {
        ...headers,
        Authorization: `Bearer ${process.env.TOKEN} ID: ${process.env.BOT_ID}`
      }
    });
  }

  async getAllLicenses() {
    return axios.get(this.baseLicensesUrl);
  }

  async getLicenseById(id) {
    return axios.get(`${this.baseLicensesUrl}/info/${id}`);
  }

  async updateLicenseById(id, data) {
    return axios.patch(`${this.baseLicensesUrl}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN} ID: ${process.env.BOT_ID}`
      }
    });
  }

  async getAllOrders(skip, limit) {
    const requestUrl = new url.URL(this.baseOrderUrl);

    requestUrl.searchParams.append('skip', skip.toString());
    requestUrl.searchParams.append('limit', limit.toString());

    return axios.get(requestUrl.href, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN} ID: ${process.env.BOT_ID}`
      }
    });
  }

  async getOrderById(id) {
    return axios.get(`${this.baseOrderUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN} ID: ${process.env.BOT_ID}`
      }
    });
  }

  async getAllUsers(skip, limit) {
    const requestUrl = new url.URL(this.baseUsersUrl);

    requestUrl.searchParams.append('skip', skip.toString());
    requestUrl.searchParams.append('limit', limit.toString());

    return axios.get(requestUrl.href, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN} ID: ${process.env.BOT_ID}`
      }
    });
  }

  async getUserById(id) {
    return axios.get(`${this.baseUsersUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN} ID: ${process.env.BOT_ID}`
      }
    });
  }

  async register() {
    return axios.post(this.baseBotsUrl, {
      botId: process.env.BOT_ID,
      token: process.env.TOKEN
    });
  }

  async updateToken(token) {
    return axios.patch(this.baseBotsUrl, {
      botId: process.env.BOT_ID,
      newToken: process.env.TOKEN,
      token
    });
  }
};
