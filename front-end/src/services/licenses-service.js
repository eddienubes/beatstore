import axios from "axios";

export default class LicensesService {
    baseUrl = 'http://localhost:5000/api/licenses';

    async getAllLicenses() {
        return axios.get(this.baseUrl);
    }
}