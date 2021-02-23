import axios from "axios";

class AuthService {
    baseUrl = 'http://localhost:5000/api/users';

    async signup(data) {
        return axios.post(
            this.baseUrl + '/signup',
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        );
    }

    async login(data) {
        return axios.post(
            this.baseUrl + '/login',
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    async updateUser(id, newUserData) {
        return axios.patch(this.baseUrl + `/${id}`, newUserData);
    }
}

export default AuthService;