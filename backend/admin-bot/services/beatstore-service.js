const axios = require('axios');
const url = require('url');
const botConfig = require('../config.json');

module.exports = class BeatstoreService {
    baseBeatsUrl = 'http://localhost:5000/api/beats';
    baseLicensesUrl = 'http://localhost:5000/api/licenses';
    baseOrderUrl = 'http://localhost:5000/api/orders';
    baseUsersUrl = 'http://localhost:5000/api/users';
    baseBotsUrl = 'http://localhost:5000/api/bots';

    async getAllBeats(skip, limit) {
        const requestUrl = new url.URL(this.baseBeatsUrl);

        requestUrl.searchParams.append('skip', skip.toString());
        requestUrl.searchParams.append('limit', limit.toString());

        return axios.get(requestUrl.href);
    }

    async getBeatById(id) {
        const requestUrl = new url.URL(this.baseBeatsUrl + `/${id}`);
        return axios.get(requestUrl.href);
    }

    async updateBeatById(id, data, headers) {
        const requestUrl = new url.URL(this.baseBeatsUrl + `/${id}`);
        return axios.patch(requestUrl.href, data, {
            headers: {
                ...headers,
                'Authorization': 'Bearer ' + botConfig.token + ' ID: ' + botConfig.botId
            }
        });
    }

    async deleteBeaById(id) {
        const requestUrl = new url.URL(this.baseBeatsUrl + `/${id}`);
        return axios.delete(requestUrl.href, {
            headers: {
                'Authorization': 'Bearer ' + botConfig.token + ' ID: ' + botConfig.botId
            }
        });
    }

    async createNewBeat(data, headers) {
        return axios.post(this.baseBeatsUrl, data, {
            headers: {
                ...headers,
                'Authorization': 'Bearer ' + botConfig.token + ' ID: ' + botConfig.botId
            }
        });
    }

    async getAllLicenses() {
        return axios.get(this.baseLicensesUrl);
    }

    async getLicenseById(id) {
        return axios.get(this.baseLicensesUrl + `/info/${id}`);
    }

    async updateLicenseById(id, data) {
        return axios.patch(this.baseLicensesUrl + `/${id}`, data, {
            headers: {
                'Authorization': 'Bearer ' + botConfig.token + ' ID: ' + botConfig.botId
            }
        });
    }

    async getAllOrders(skip, limit) {
        const requestUrl = new url.URL(this.baseOrderUrl);

        requestUrl.searchParams.append('skip', skip.toString());
        requestUrl.searchParams.append('limit', limit.toString());

        return axios.get(requestUrl.href, {
            headers: {
                'Authorization': 'Bearer ' + botConfig.token + ' ID: ' + botConfig.botId
            }
        });
    }

    async getOrderById(id) {
        return axios.get(this.baseOrderUrl + `/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + botConfig.token + ' ID: ' + botConfig.botId
            }
        });
    }

    async getAllUsers(skip, limit) {
        const requestUrl = new url.URL(this.baseUsersUrl);

        requestUrl.searchParams.append('skip', skip.toString());
        requestUrl.searchParams.append('limit', limit.toString());

        return axios.get(requestUrl.href, {
            headers: {
                'Authorization': 'Bearer ' + botConfig.token + ' ID: ' + botConfig.botId
            }
        });
    }

    async getUserById(id) {
        return axios.get(this.baseUsersUrl + `/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + botConfig.token + ' ID: ' + botConfig.botId
            }
        });
    }

    async register() {
        return axios.post(this.baseBotsUrl, {
            botId: botConfig.botId,
            token: botConfig.token
        })
    }

    async updateToken(token) {
        return axios.patch(this.baseBotsUrl, {
            botId: botConfig.botId,
            newToken: botConfig.token,
            token: token
        });
    }
}