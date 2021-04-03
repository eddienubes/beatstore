import axios from "axios";

export default class OrdersService {
    baseUrl = process.env.REACT_APP_BACKEND_ASSET_URL + 'orders';

    async createPaypalOrder(email, cartItems, successUrl, cancelUrl) {
        return axios.post(this.baseUrl + '/paypal-create', {email, cartItems, cancelUrl, successUrl});
    }

    async capturePaypalOrder(orderId, token) {
        return axios.post(this.baseUrl + '/paypal-capture', {orderId, token});
    }

    async createOrderWithWayforpay(email, cartItems) {
        return axios.post(this.baseUrl + '/wayforpay-create', {email, cartItems});
    }
}