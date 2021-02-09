import React, {useState} from "react";
import {Link, useHistory} from 'react-router-dom';
import "./header.scss";
import Navbar from "react-bootstrap/cjs/Navbar";
import Nav from "react-bootstrap/cjs/Nav";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faAngleRight,
    faBars,
    faFileInvoice,
    faShoppingCart,
    faSignOutAlt,
    faStore,
    faTimes,
    faUser,
    faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import Button from "@material-ui/core/Button";
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import {ClickAwayListener, MenuItem, MenuList} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {loggedOut} from "../../redux/actions/actions";

const Header = () => {
    const [isOpenedBurger, setOpenBurger] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const {loggedIn} = useSelector(state => state.userReducer);
    const [openLogDropdown, setOpenLogDropdown] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpenLogDropdown((prevOpen) => !prevOpen);
    };

    const handleCloseDropdown = (path) => (event) => {
        if (path) {
            history.replace(path);
        }
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpenLogDropdown(false);
    };

    const prevOpen = React.useRef(openLogDropdown);
    React.useEffect(() => {
        if (prevOpen.current === true && openLogDropdown === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = openLogDropdown;
    }, [openLogDropdown]);

    const handleListKeyDown = (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpenLogDropdown(false);
        }
    }

    let navbarStyles = "justify-content-between bg-black";

    if (isOpenedBurger)
        navbarStyles += " curtain-padding";
    else
        navbarStyles = "justify-content-between bg-black";

    const SwitchIcon = (isOpened) => {
        if (isOpened) {
            return <FontAwesomeIcon icon={faTimes}/>;
        }
        return <FontAwesomeIcon icon={faBars}/>;
    };

    const ToggleMenu = ({id, "aria-controls": area, onClick, className}) => {

        const switchUtility = () => {
            setOpenBurger(!isOpenedBurger);
            onClick()
        };

        return (
            <button aria-controls={area}
                    onClick={switchUtility}
                    className={className}
                    id={id}>{SwitchIcon(isOpenedBurger)}
            </button>
        );
    }

    const logDependentItem = loggedIn ? (
        <>
            <Button
                className="login-menu-toggle-button"
                ref={anchorRef}
                aria-controls={openLogDropdown ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <FontAwesomeIcon icon={faUserCircle}/>&nbsp;Profile
                &nbsp;
                {
                    openLogDropdown ?
                        <FontAwesomeIcon icon={faAngleDown}/> :
                        <FontAwesomeIcon icon={faAngleRight}/>
                }
            </Button>
            <Popper
                className="login-menu"
                open={openLogDropdown}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal>
                {({TransitionProps, placement}) => (
                    <Grow
                        {...TransitionProps}
                        style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
                    >
                        <Paper className="paper-menu">
                            <ClickAwayListener onClickAway={handleCloseDropdown()}>
                                <MenuList autoFocusItem={openLogDropdown} id="menu-list-grow"
                                          onKeyDown={handleListKeyDown}>
                                    <MenuItem onClick={handleCloseDropdown('/account/profile')}>
                                        <FontAwesomeIcon
                                            icon={faFileInvoice}/> &nbsp; &nbsp; Account</MenuItem>
                                    <MenuItem
                                        onClick={handleCloseDropdown('/account/purchases')}><FontAwesomeIcon
                                        icon={faStore}/> &nbsp; Purchases</MenuItem>
                                    <hr/>
                                    <MenuItem onClick={() => {
                                        handleCloseDropdown('/logout');
                                        dispatch(loggedOut());
                                    }}><FontAwesomeIcon
                                        icon={faSignOutAlt}/> &nbsp; Logout</MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>) : (<Nav.Link className="invert login" to="/auth/login" as={Link}><FontAwesomeIcon
        icon={faUser}/> Log In</Nav.Link>);

    return (

        <header>
            <Navbar className={navbarStyles} variant="dark" expand="sm">
                <Navbar.Brand className="nav__main-caption" to="/" as={Link}>Cherries</Navbar.Brand>
                <Navbar.Toggle id="baton" aria-controls="nav-bar" as={ToggleMenu}/>
                <Navbar.Collapse id="nav-bar">
                    <Nav>
                        <Nav.Link to="/beats" as={Link}>Beats</Nav.Link>
                        <Nav.Link to="/contact" as={Link}>Contact</Nav.Link>
                        <Nav.Link to="/about" as={Link}>About</Nav.Link>
                        <Nav.Link className="header__cart-button" to="/checkout" as={Link}>
                            <FontAwesomeIcon className="header__cart-icon" icon={faShoppingCart}/> Cart
                        </Nav.Link>

                        {logDependentItem}
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
