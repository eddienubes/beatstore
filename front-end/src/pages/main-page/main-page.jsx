import React from "react";
import BigSearch from "../../components/big-search/big-search";
import TracksTable from "../../components/tracks-table";
import PriceCardsList from "../../components/price-card-list";
import ContactFormContainer from "../../containers/contact-form-container/contact-form-container";

const MainPage = () =>
    (
        <>
            <BigSearch/>
            <TracksTable/>
            <PriceCardsList/>
            <ContactFormContainer/>
        </>
    );

export default MainPage;
