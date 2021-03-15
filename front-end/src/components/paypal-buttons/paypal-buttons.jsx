import React from 'react';
import ReactDOM from 'react-dom';
import OrdersService from "../../services/orders-service";
import SpinnerAudio from "../spinner-audio";
import {connect} from 'react-redux';
import scriptLoader from 'react-async-script-loader';

import './paypal-buttons.scss';

let PayPalButton = null;

class PaypalButtons extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showButtons: false,
            loading: true,
            paid: false,
            token: null
        }

        window.React = React;
        window.ReactDOM = ReactDOM;
        this.paypalRef = React.createRef();
    }

    componentDidMount() {
        const {isScriptLoaded, isScriptLoadSucceed} = this.props;

        if (isScriptLoaded && isScriptLoadSucceed) {
            // PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
            window.paypal.Buttons({
                createOrder: this.createOrder,
                onApprove: this.handleApprove,
                style: {
                    layout: 'horizontal',
                    tagline: false
                },
            }).render(this.paypalRef.current);

            this.setState({loading: false, showButtons: true});
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {isScriptLoaded, isScriptLoadSucceed} = nextProps;

        const scriptJustLoaded =
            !this.state.showButtons && !this.props.isScriptLoaded && isScriptLoaded;

        if (scriptJustLoaded) {
            if (isScriptLoadSucceed) {
                // PayPalButton = window.paypal.Buttons.driver("react", {
                //     React,
                //     ReactDOM
                // });
                window.paypal.Buttons({
                    createOrder: this.createOrder,
                    onApprove: this.handleApprove,
                    style: {
                        layout: 'horizontal',
                        tagline: false

                    },
                }).render(this.paypalRef.current);

                this.setState({loading: false, showButtons: true});
            }
        }
    }

    createOrder = (data, actions) => {
        const ordersService = new OrdersService();
        return ordersService.createPaypalOrder(this.props.email, this.props.cart.items)
            .then(res => res)
            .then(({data}) => {
                this.setState(state => {
                    return {
                        ...state,
                        token: data.token
                    }
                });
                return data.orderId
            });
    }

    handleApprove = (data, actions) => {
        const ordersService = new OrdersService();
        return ordersService.capturePaypalOrder(data.orderID, this.state.token)
            .then(res => {
                this.setState(state => {
                    return {
                        ...state,
                        token: null
                    }
                });
            }).catch(e => console.log(e.message));
    }

    handleError = (err) => {
        this.setState(state => {
            return {
                ...state,
                token: null
            }
        });
    }

    render() {
        const {showButtons, loading, paid} = this.state;

        return (
            <>
                {loading && <SpinnerAudio/>}
                <div className={`paypal-buttons ${this.props.disabled ? 'disabled-paypal-button': null}`} ref={this.paypalRef}/>
            </>
        )
    }

}

const mapStateToProps = (state) => {
    const {
    userReducer
}

= state;
return {cart: userReducer.cart, email: userReducer.email}
}

export default scriptLoader
('https://www.paypal.com/sdk/js?client-id=AYbytmYzSknNDYw7g0Ip917i0u8HSb6i96RgeTAvNlLrSn8YiaIAlvfzV47_EM3ln-4MLOxZBTTltT4x')
(connect(mapStateToProps)(PaypalButtons));