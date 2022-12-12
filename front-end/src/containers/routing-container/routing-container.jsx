import React, { Suspense, useEffect } from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/header';

import MusicPlayer from '../../components/music-player';
import Footer from '../../components/footer';
import Spinner from '../../components/spinner';
import useAuth from '../../hooks/auth-hook';
import { fetchLicenses } from '../../redux/actions';
import BlurredSpinner from '../../components/blurred-spinner';

const ContactPage = React.lazy(() => import('../../pages/contact-page'));
const CheckoutPage = React.lazy(() => import('../../pages/checkout-page'));
const BeatsPage = React.lazy(() => import('../../pages/beats-page'));
const AuthContainer = React.lazy(() => import('../auth-container'));
const AccountPage = React.lazy(() => import('../../pages/account-page'));
const ConfirmationPage = React.lazy(() => import('../../pages/confirmation-page'));
const PurchaseSuccessful = React.lazy(() => import('../../pages/purchase-successful'));
const PurchaseFailed = React.lazy(() => import('../../pages/purchase-failed'));
const MainPage = React.lazy(() => import('../../pages/main-page'));
const PageNotFound = React.lazy(() => import('../../components/page-not-found'));
const SingleBeatPage = React.lazy(() => import('../../pages/single-beat-page'));

function RoutingContainer() {
  const [checking] = useAuth();
  const dispatch = useDispatch();
  const { isLoadingAppendToCart, isLoggingOut, isProcessingPayment, processing } = useSelector((state) => state.userReducer);
  useEffect(() => {
    dispatch(fetchLicenses());
  }, []);

  if (checking || isLoggingOut || processing) {
    return <Spinner />;
  }

  return (
    <Router>
      {isLoadingAppendToCart || isProcessingPayment ? <BlurredSpinner /> : null}
      <Header />
      <main>
        <Suspense fallback={<Spinner />}>
          <MusicPlayer />
          <Switch>
            <Route exact path="/" component={MainPage} />
            <Route exact path="/contact" component={ContactPage} />
            <Route exact path="/checkout" component={CheckoutPage} />
            <Route exact path="/beats" component={BeatsPage} />
            <Route exact path="/beats/:id" component={SingleBeatPage} />
            <Route path="/auth" component={AuthContainer} />
            <Route path="/account" component={AccountPage} />
            <Route path="/checkout/success" exact component={PurchaseSuccessful} />
            <Route path="/checkout/failed" exact component={PurchaseFailed} />
            <Route path="/confirmation/:confirmationCode" exact component={ConfirmationPage} />
            <Route component={PageNotFound} />
          </Switch>
        </Suspense>
      </main>
      <Footer />
    </Router>
  );
}

export default RoutingContainer;
