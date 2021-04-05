import React, {Component} from 'react';
import {connect} from 'react-redux';
import './wayforpay-buttons.scss';
import scriptLoader from 'react-async-script-loader';
import OrdersService from "../../services/orders-service";
import SpinnerAudio from "../spinner-audio";
import {paymentAcceptedAndRedirected, paymentDeclinedAndRedirected, paymentRequested} from "../../redux/actions";

class WayforpayButtons extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            showButtons: true
        }

        this.wayforpayRef = React.createRef();
    }

    componentDidMount() {
        const {isScriptLoaded, isScriptLoadSucceed} = this.props;

        if (isScriptLoaded && isScriptLoadSucceed) {
            this.wayforpayRef.current = new window.Wayforpay();
            this.setState({loading: false, showButtons: true});
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {isScriptLoaded, isScriptLoadSucceed} = nextProps;

        const scriptJustLoaded =
            !this.state.showButtons && !this.props.isScriptLoaded && isScriptLoaded;


        if (scriptJustLoaded) {
            if (isScriptLoadSucceed) {
                this.wayforpayRef.current = new window.Wayforpay();
                this.setState({loading: false, showButtons: true});
            }
        }
    }

    createOrder = (e) => {
        e.preventDefault();
        const ordersService = new OrdersService();
        this.props.paymentRequested();

        ordersService.createOrderWithWayforpay(this.props.email, this.props.cart.items)
            .then(res => {
                console.log('Run wayforpay payment!');
                console.log(res.data.order);
                (new window.Wayforpay()).run(
                    res.data.order,
                    this.handleApprove,
                    this.handleError
                )
            })
            .catch(e => {
                console.log(e.message);

            });
    }

    handleApprove = (res) => {
        this.props.paymentAccepted(this.props.history);
    }

    handleError = (err) => {
        this.props.paymentDeclined(err, this.props.history);
    }

    render() {
        const {loading} = this.props;

        return (
            <>
                {loading && <SpinnerAudio/>}
                <button onClick={this.createOrder} className={`wayforpay ${this.props.disabled ? 'disabled-wayforpay-button' : null}`} type="submit">
                    <span>Checkout</span>
                </button>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    const {
        userReducer
    } = state;
    return {
        cart: userReducer.cart,
        email: userReducer.email
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        paymentRequested: () => dispatch(paymentRequested()),
        paymentAccepted: (history) => dispatch(paymentAcceptedAndRedirected(history)),
        paymentDeclined: (err, history) => dispatch(paymentDeclinedAndRedirected(err, history))
    }
}

export default scriptLoader
('https://secure.wayforpay.com/server/pay-widget.js')
(connect(mapStateToProps, mapDispatchToProps)(WayforpayButtons))




