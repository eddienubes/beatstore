import React, {useEffect} from "react";

import Header from "../../components/header";
import PageNotFound from "../../components/page-not-found";
import ErrorIndicator from "../../components/error-indicator";
import Footer from "../../components/footer/footer";
import MainPage from "../../pages/main-page";
import ContactPage from "../../pages/contact-page";
import CheckoutPage from "../../pages/checkout-page";

import {
    Switch,
    Route,
    BrowserRouter as Router
} from "react-router-dom";

import ReactJkMusicPlayer from "react-jinke-music-player";
import 'react-jinke-music-player/assets/index.css';
import 'react-jinke-music-player/lib/styles/index.less'
import MusicPlayer from "../../components/music-player";
import BeatsPage from "../../pages/beats-page";
import LoginPage from "../../pages/auth-pages/login-page";
import RegisterPage from "../../pages/auth-pages/register-page/";
import AuthContainer from "../auth-container";
import AccountPage from "../../pages/account-page";


const RoutingContainer = () => {
    const beats = [].map((track) => {
        return ({
            name: track.name,
            musicSrc: track.audioUrl,
            cover: track.imgUrl
        })
    });

    return (
        <Router>
            <Header/>
            <MusicPlayer/>
            <Switch>

                <Route exact path="/" component={MainPage}/>
                <Route exact path="/contact" component={ContactPage}/>
                <Route exact path="/checkout" component={CheckoutPage}/>
                {/*<Route exact path="/beats" component={BeatsPage}/>*/}
                <Route path="/auth" component={AuthContainer}/>
                <Route path="/account" component={AccountPage}/>
                <Route component={PageNotFound}/>
            </Switch>
            <Footer/>
        </Router>
    );
}

export default RoutingContainer;
