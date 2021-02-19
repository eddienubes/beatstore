import React from "react";

import Header from "../../components/header";
import PageNotFound from "../../components/page-not-found";
import MainPage from "../../pages/main-page";
import ContactPage from "../../pages/contact-page";
import CheckoutPage from "../../pages/checkout-page";

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import 'react-jinke-music-player/assets/index.css';
import 'react-jinke-music-player/lib/styles/index.less'
import MusicPlayer from "../../components/music-player";
import BeatsPage from "../../pages/beats-page";
import AuthContainer from "../auth-container";
import AccountPage from "../../pages/account-page";
import Footer from "../../components/footer";


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
                <main>
                    <MusicPlayer/>
                    <Switch>

                        <Route exact path="/" component={MainPage}/>
                        <Route exact path="/contact" component={ContactPage}/>
                        <Route exact path="/checkout" component={CheckoutPage}/>
                        <Route exact path="/beats" component={BeatsPage}/>
                        <Route exact path="/beats/:id" component={BeatsPage}/>
                        <Route path="/auth" component={AuthContainer}/>
                        <Route path="/account" component={AccountPage}/>
                        <Route component={PageNotFound}/>
                    </Switch>
                </main>
            <Footer/>
        </Router>

    );
}

export default RoutingContainer;
