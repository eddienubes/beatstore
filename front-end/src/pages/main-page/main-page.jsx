import React from 'react';
import BigSearch from '../../components/big-search/big-search';
import TracksTable from '../../components/tracks-table';
import PriceCardsList from '../../components/price-card-list';
import ContactFormContainer from '../../containers/contact-form-container/contact-form-container';
import FeaturedTrack from '../../components/featured-track';
import BrowseAllButton from '../../components/browse-all-button';

function MainPage() {
  return (
    <>
      <BigSearch isMain />
      <FeaturedTrack />
      <TracksTable />
      <BrowseAllButton />
      <PriceCardsList />
      <ContactFormContainer />
    </>
  );
}

export default MainPage;
