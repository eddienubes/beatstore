import axios from 'axios';

export default class LicensesService {
  baseUrl = `${process.env.REACT_APP_BACKEND_ASSET_URL}licenses`;

  async getAllLicenses() {
    return axios.get(this.baseUrl);
  }

  async getLicenseTemplate(type) {
    return axios.get(`${this.baseUrl}/${type}`);
  }
}
