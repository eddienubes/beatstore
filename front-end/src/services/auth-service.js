import axios from "axios";

class AuthService {
    baseUrl = process.env.REACT_APP_BACKEND_ASSET_URL + 'users';

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

    async verify(confirmationCode) {
        return axios.post(
            this.baseUrl + '/verify/' + confirmationCode,
            {confirmationCode},
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
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

    async googleLogin(tokenId) {
        return axios.post(this.baseUrl + '/login-google', {tokenId: tokenId});
    }

    async googleSignup(tokenId) {
        return axios.post(this.baseUrl + '/signup-google', {tokenId: tokenId});
    }

    async logout(token) {
        return axios.post(this.baseUrl + '/logout', {}, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });
    }

    async refreshToken(refreshToken) {
        return axios.post(this.baseUrl + '/token', {refreshToken: refreshToken});
    }

    async removeFromCartOffline(productId, cart) {
        return axios.patch(this.baseUrl + '/cart' + `/${productId}`, {cart: cart});
    }

    async appendToCartOffline(product, cart) {
        return axios.post(this.baseUrl + '/cart', {cart: cart, product: product});
    }

    async contact(email, subject, name, message) {
        return axios.post(this.baseUrl + '/contact', {
            email,
            subject,
            name,
            message
        });
    }

    async getUserCartById(id, token) {
        return axios.get(this.baseUrl + '/cart/' + id, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
    }
}

export default AuthService;