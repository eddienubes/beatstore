import React from 'react';
import {useSelector} from "react-redux";

const withSearch = (Wrapped) => {


    const filter = (beat, q) => {

        // if (q === "") {
        //     return true;
        // }
        //
        // const queries = q.split(" ");
        //
        // for (let query of queries) {
        //     if (
        //         (query !== "") &&
        //         ((beat.name.toLowerCase().includes(query.toLowerCase())) ||
        //             (beat.bpm.toString().includes(query.toLowerCase())) ||
        //             (beat.tags.join(" ").toLowerCase().includes(query.toLowerCase())))
        //     )
        //         return true;
        // }
        //
        // return false;
        return true;
    };


    return (props) => {
        const search = "";

        return (<Wrapped {...props} search={search} filter={filter}/>);
    }
};

export default withSearch;