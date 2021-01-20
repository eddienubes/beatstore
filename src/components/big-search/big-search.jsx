import React from "react";
import "./big-search.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

const BigSearch = () => {

    const search = (e) => {
        console.log(e);
        console.log(document.getElementById('search').value);
    }

    return (
        <div className="big-search">
            <h1 className="glitch" data-text="Cherries By">Cherries By</h1>
            <span className="sub">BEATSTORE</span>
            {/*<h1 className="logo">Cherries By</h1>*/}
            <div className="search">
                <input placeholder="Search..."
                       id="search"
                       type="search"/>
                <button className="search-magnifier-button">
                    <FontAwesomeIcon icon={faSearch}/>
                </button>
            </div>
        </div>
    );
}


export default BigSearch;
