import React, {useContext, useState} from "react";
import "./header.scss";
import Navbar from "react-bootstrap/cjs/Navbar";
import Nav from "react-bootstrap/cjs/Nav";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";


const Header = () => {
    const [isOpened, setOpen] = useState(false);

    let navbarStyles = "justify-content-between bg-black";

    if (isOpened)
        navbarStyles += " curtain-padding";
    else
        navbarStyles = "justify-content-between bg-black";

    const SwitchIcon = (isOpened) => {
        if (isOpened) {
            return <FontAwesomeIcon icon={faTimes}/>;
        }
        return <FontAwesomeIcon icon={faBars}/>;
    };

    const ToggleMenu = ({id, "aria-controls":area, onClick, className}) => {

        const switchUtility = () => {setOpen(!isOpened); onClick()};

        return(
            <button aria-controls={area}
                    onClick={switchUtility}
                    className={className}
                    id={id}>{SwitchIcon(isOpened)}
            </button>
        );
    }

    return (

        <header>
            <Navbar className={navbarStyles} variant="dark" expand="sm">
                <Navbar.Brand className="nav__main-caption" to="/" as={Link}>Cherries</Navbar.Brand>
                <Navbar.Toggle id="baton" aria-controls="nav-bar" as={ToggleMenu}/>
                <Navbar.Collapse id="nav-bar">
                    <Nav>
                        <Nav.Link to="/tracks" as={Link}>Beats</Nav.Link>
                        <Nav.Link to="/contact" as={Link}>Contact</Nav.Link>
                        <Nav.Link to="/about" as={Link}>About</Nav.Link>
                        <Nav.Link className="header__cart-button" to="/checkout" as={Link}>
                            <FontAwesomeIcon className="header__cart-icon" icon={faShoppingCart}/> Cart
                        </Nav.Link>
                        <Nav.Link className="invert login" to="/login" as={Link}><FontAwesomeIcon icon={faUser}/> Log In</Nav.Link>

                        {/*{*/}
                        {/*    !customer.isLoggedIn*/}
                        {/*        ? <Nav.Link className="invert login" to="/login" as={Link}><FontAwesomeIcon icon={faUser}/>Log In</Nav.Link>*/}
                        {/*        : <button className="invert-button" onClick={() => {*/}
                        {/*            loggedIn();*/}
                        {/*            localStorage.removeItem('token')*/}
                        {/*        }}>Log out</button>*/}
                        {/*}*/}

                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </header>
    );
}


export default Header;
