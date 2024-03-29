import React, { useEffect } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import './account-page.scss';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';

import { useSelector } from 'react-redux';
import UserProfile from '../../components/user-profile';
import PurchasesTable from '../../components/purchases-table';
import Footer from '../../components/footer';

const themeOverrided = createMuiTheme({
  overrides: {
    MuiPaper: {
      root: {
        // backgroundColor: '#ff00c1',
      }
    },
    MuiTouchRipple: {
      root: {
        text: {
          textColorcolor: 'white'
        }
      }
    },
    MuiTabs: {
      overflowX: 'visible',
      root: {
        overflowX: 'visible'
      },
      text: {
        color: 'white'
      },
      indicator: {
        textColor: '#ff00c1',
        backgroundColor: '#ff00c1'
      }
    }
  }
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      style={{ overflow: 'visible' }}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const a11yProps = (index) => ({
  id: `full-width-tab-${index}`,
  'aria-controls': `full-width-tabpanel-${index}`
});

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiPaper-root': {
      backgroundColor: '#000000'
    },
    backgroundColor: theme.palette.background.paper,
    width: 500
  },
  tabs: {
    overflowX: 'visible'
  },
  overrides: {
    // backgroundColor: "#ff00c1"
  }
}));

function AccountPage() {
  const location = useLocation();
  const history = useHistory();
  const { loggedIn } = useSelector((state) => state.userReducer);
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if (location.pathname.split('/').pop() === 'profile') {
      setValue(0);
    } else if (location.pathname.split('/').pop() === 'purchases') {
      setValue(1);
    }
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);

    if (newValue === 0) {
      history.push('/account/profile');
    } else if (newValue === 1) {
      history.push('/account/purchases');
    }
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  if (!loggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div className={`${classes.root} account-page`}>
      <MuiThemeProvider theme={themeOverrided}>
        <AppBar position="static" color="default">
          <Tabs
            centered
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            aria-label="full width tabs example"
            className={classes.tabs}
          >
            <Tab className="account-page__tab" label="Profile" {...a11yProps(0)} />
            <Tab className="account-page__tab" label="Purchases" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
          slideStyle={{ overflow: 'visible' }}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <UserProfile />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <PurchasesTable />
          </TabPanel>
        </SwipeableViews>
      </MuiThemeProvider>
    </div>
  );
}

export default AccountPage;
