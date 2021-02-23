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

    async updateUser(id, newUserData, token) {
        return axios.patch(this.baseUrl + `/${id}`, newUserData);
    }

    async appendToCart(userId, product, token) {
        console.log(token);
        return axios.post(this.baseUrl + `/${userId}` + '/cart', product, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });
    }

    async removeFromCart(userId, productId, token) {
        return axios.delete(this.baseUrl + `/${userId}` + '/cart' + `/${productId}`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });
    }
}

export default AuthService;