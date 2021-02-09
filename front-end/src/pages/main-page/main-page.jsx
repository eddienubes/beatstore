import React from "react";
import BigSearch from "../../components/big-search/big-search";
import TracksTable from "../../components/tracks-table";
import PriceCardsList from "../../components/price-card-list";
import ContactFormContainer from "../../containers/contact-form-container/contact-form-container";
import Footer from "../../components/footer";
import {BrowserRouter as Router} from "react-router-dom";

const MainPage = () =>
    (
        <>
            <BigSearch/>
            <TracksTable hasMoreByDefault={false}/>
            <PriceCardsList/>
            <ContactFormContainer/>
        </>
    );

export default MainPage;
