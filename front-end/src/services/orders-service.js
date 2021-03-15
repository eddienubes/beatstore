import axios from "axios";

export default class OrdersService {
    baseUrl = 'http://localhost:5000/api/orders';

    async createPaypalOrder(email, cartItems, successUrl, cancelUrl) {
        return axios.post(this.baseUrl + '/paypal-create', {email, cartItems, cancelUrl, successUrl});
    }

    async capturePaypalOrder(orderId, token) {
        return axios.post(this.baseUrl + '/paypal-capture', {orderId, token});
    }
}