import React from "react";
import BigSearch from "../../components/big-search/big-search";
import TracksTable from "../../components/tracks-table";
import PriceCardsList from "../../components/price-card-list";

const MainPage = () =>
    (
        <>
            <BigSearch/>
            <TracksTable/>
            <PriceCardsList/>
        </>
    );

export default MainPage;
