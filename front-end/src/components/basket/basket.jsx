import React, {useCallback} from "react";
import './basket.scss';
import BasketItem from "../basket-item";
import {Table} from "semantic-ui-react";
import PlaceholderAnimatedButton from "../placeholder-animated-button";
import {Link} from "react-router-dom";
import LicenseDescriptionModal from "../license-description-modal";
import {useSelector} from "react-redux";
import BrowseAllButton from "../browse-all-button";
import AnimationContainer from "../../containers/animation-container";
import SpinnerAudio from "../spinner-audio";
import useAudio from "../../hooks/audio-hook";
import {audioLoaded, audioPlayed, audioStopped} from "../../redux/actions";

const Basket = () => {
    const [isDisabled, setDisabled] = React.useState(true);
    const [modalShow, setModalShow] = React.useState(false);
    const {cart, isLoadingRemoveFromCart, loggedIn} = useSelector(state => state.userReducer);
    const {id, isPlaying, previousId} = useSelector(state => state.audioReducer);

    if (cart.items.length === 0) {
        return (
            <>
                <p className={`empty-cart-caption`}>Your cart is completely empty. Fill it with some beats :)</p>
                <BrowseAllButton/>
            </>
        );
    }

    const checkInputHandler = (e) => {
        setDisabled(!isDisabled)
    };


    return (
        <div className="basket__container">
            <Table className="cart" celled structured striped unstackable>
                <Table.Header className="header">
                    <Table.Row>
                        <Table.HeaderCell width={1} className="header-item">
                            {isLoadingRemoveFromCart ? <SpinnerAudio/> : null}
                        </Table.HeaderCell>
                        <Table.HeaderCell width={2} textAlign="left"
                                          className="header-item">PRODUCT</Table.HeaderCell>
                        <Table.HeaderCell width={3} textAlign="center" className="header-item">LICENSE
                            TYPE</Table.HeaderCell>
                        <Table.HeaderCell width={1} textAlign="center"
                                          className="header-item">AMOUNT</Table.HeaderCell>
                        <Table.HeaderCell width={4} textAlign="center" className="header-item">LICENSE
                            REVIEW</Table.HeaderCell>
                        <Table.HeaderCell width={1} textAlign="left" className="header-item"> </Table.HeaderCell>
                    </Table.Row>
                    <Table.Row>
                        <Table.HeaderCell textAlign="center" width={1} className="header-item separator">
                            TRACKS
                        </Table.HeaderCell>
                        <Table.HeaderCell colSpan='4' className="header-item separator">
                            <hr/>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        cart.items.map(i => {

                            return (
                                <AnimationContainer
                                    animationMountClass={null}
                                    key={i._id || i.id}
                                    animationUnMountClass={`cart-item-deleted-animation`} >
                                    <BasketItem
                                        id={i._id || i.id}
                                        imgUrl={i.beatId.imgUrl}
                                        amount={i.licenseId.price}
                                        licenseType={i.licenseId.label}
                                        product={i.beatId.title}
                                        beatId={i.beatId._id}
                                        currentId={id}
                                        isPlaying={isPlaying}
                                        previousId={previousId}
                                    />
                                </AnimationContainer>
                                )
                        })
                    }
                </Table.Body>
            </Table>
            <aside className="sidebar">
                <div className="sidebar-container">
                    <form>
                        <PlaceholderAnimatedButton className={"coupon-input"}
                                                   labelStyle={"label-style"}
                                                   name="coupon"
                                                   text="Bonus coupon"
                                                   required={true}>
                        </PlaceholderAnimatedButton>
                        <button className="coupon-button" type="submit">APPLY COUPON</button>
                    </form>
                    <form>
                        <div className="numbers-container gross">
                            <div>Gross</div>
                            {/*PUT GROSS VALUE HERE*/}
                            <div className="number">
                                ${123}
                            </div>
                        </div>
                        <div className="numbers-container discount">
                            <div>Discount</div>
                            {/*PUT DISCOUNT VALUE HERE*/}
                            <div className="discount-number number">-$0.00</div>
                        </div>
                        <div className="numbers-container total">
                            <div>Total</div>
                            <div className="total-number number">${cart.total.toFixed(2)}</div>
                        </div>
                        {/*TODO: MODAL RELOADS PAGE ISSUE*/}
                        {/*<PolicyBox className="button-review" text="REVIEW LICENSE"/>*/}

                        <button className="coupon-button" type="button" onClick={() => setModalShow(true)}>READ
                            LICENSE
                        </button>
                        {
                            !loggedIn ? (<PlaceholderAnimatedButton className={"coupon-input"}
                                                                   labelStyle={"label-style"}
                                                                   name="email"
                                                                   text="Enter your email"
                                                                   required={true}>
                            </PlaceholderAnimatedButton>) : (<p className={`email-caption-warning`}>Beats will be sent on email your current account logged in with.</p>)
                        }

                        <LicenseDescriptionModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                        />

                        <div className="agreement">
                            <label className="cart-label">
                                <input onChange={(e) => checkInputHandler(e)} type="checkbox" name="checked"/>
                                <span className="labeled-text">
                I reviewed and agree to the Track(s) License Agreements
                </span>
                            </label>
                            <button type="submit" className="buy-button" disabled={isDisabled}>PURCHASE</button>
                        </div>
                    </form>
                    <span className="offer-sign-up">Would you like keep records of your Transaction(s)
                for future download of your Purchased files? <Link to="/register">Login or Create</Link> a free account here.</span>
                </div>
            </aside>
        </div>
    )
};


export default Basket;

