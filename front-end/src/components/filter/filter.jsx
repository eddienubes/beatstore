import React, {useEffect, useMemo, useState} from 'react';
import {Dropdown} from 'semantic-ui-react';
import {Col, Row} from 'react-bootstrap';
import {faAngleDown, faAngleUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {filter, fetchInfo} from "../../redux/actions/actions";

import './filter.scss';
import BigSearch from "../big-search/big-search";
import {useDispatch, useSelector} from "react-redux";
import Spinner from "../spinner";

export default function Filter() {
    const [open, setOpen] = useState(null);
    const dispatch = useDispatch();
    const {info, isLoadingInfo} = useSelector(state => state.beatsReducer);

    const [formState, setFormState] = useState({
        bpm: null,
        moods: null,
        genres: null,
        tags: null
    });

    useEffect(() => {
        dispatch(fetchInfo());
    }, [])

    const stateKeys = useMemo(() => ['bpm', 'moods', 'genres', 'tags'], []);

    const [bpms, moods, genres, tags] = useMemo(() => {
        return [
            [{key: 'all1', text: 'All BPM'}, ...info.bpms.map(b => {
                return {
                    key: b,
                    value: b,
                    text: b
                }
            })],
            [{key: 'all2', text: 'All moods'}, ...info.moods.map((b, index) =>  {
                return {
                    key: b + index,
                    value: b,
                    text: b
                }
            })],
            [{key: 'all3', text: 'All genres'}, ...info.genres.map((b, index) => {
                return {
                    key: b + index,
                    value: b,
                    text: b
                }
            })],
            [{key: 'all4', text: 'All tags'}, ...info.tags.map((b, index) => {
                return {
                    key: b + index,
                    value: b,
                    text: b
                }
            })]
        ]
    }, [info]);

    const onChangeHandler = (e, data) => {
        const newState = {
            ...formState,
            [stateKeys[data.tabIndex]]: data.value ? data.value : null
        }
        let isChanged = false;
        for (let i = 0; i < stateKeys.length; i++) {
            if (formState[stateKeys[i]] !== newState[stateKeys[i]]) {
                isChanged = true;
                break;
            }
        }
        if (isChanged) {
            setFormState(state => {
                return newState;
            });
            dispatch(filter(newState, Math.floor(window.innerHeight / 65)));
            console.log(newState);
        }
    }

    if (isLoadingInfo) {
        return <Spinner/>;
    }

    return (
        <>
            <BigSearch/>
            <div className={`filter`}>
                <Row lg={12} md={12} sm={12}>
                    <Col xl={3} md={4} sm={4} className={`dropdown-col`}>
                        <Dropdown
                            tabIndex={0}
                            onOpen={e => setOpen(1)}
                            onClose={e => setOpen(null)}
                            wrapSelection={true}
                            icon={<FontAwesomeIcon className={`icon`} icon={open === 1 ? faAngleUp : faAngleDown}/>}
                            className={`dropdown-itself`}
                            placeholder='All BPM'
                            fluid
                            selection
                            options={bpms}
                            onChange={onChangeHandler}
                        />
                    </Col>
                    <Col xl={3} md={4} sm={4} className={`dropdown-col`}>
                        <Dropdown
                            tabIndex={1}
                            onOpen={e => setOpen(2)}
                            onClose={e => setOpen(null)}
                            icon={<FontAwesomeIcon className={`icon`} icon={open === 2 ? faAngleUp : faAngleDown}/>}
                            className={`dropdown-itself`}
                            placeholder='All moods'
                            fluid
                            selection
                            options={moods}
                            onChange={onChangeHandler}

                        />
                    </Col>
                    <Col xl={3} md={4} sm={4} className={`dropdown-col`}>
                        <Dropdown
                            tabIndex={2}
                            onOpen={e => setOpen(3)}
                            onClose={e => setOpen(null)}
                            icon={<FontAwesomeIcon className={`icon`} icon={open === 3 ? faAngleUp : faAngleDown}/>}
                            className={`dropdown-itself`}
                            placeholder='All genres'
                            fluid
                            selection
                            options={genres}
                            onChange={onChangeHandler}

                        />
                    </Col>
                    <Col xl={3} md={12} sm={12} className={`dropdown-col`}>
                        <Dropdown
                            tabIndex={3}
                            onOpen={e => setOpen(4)}
                            onClose={e => setOpen(null)}
                            icon={<FontAwesomeIcon className={`icon`} icon={open === 4 ? faAngleUp : faAngleDown}/>}
                            className={`dropdown-itself`}
                            placeholder='All tags'
                            fluid
                            selection
                            options={tags}
                            onChange={onChangeHandler}
                        />
                    </Col>
                </Row>


            </div>
        </>

    );
}