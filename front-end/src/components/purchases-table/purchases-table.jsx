import React from 'react';
import { Dropdown, Label, Table } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import box from './box.png';
import './purchases-table.scss';
import useAudio from '../../hooks/audio-hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faFileDownload } from '@fortawesome/free-solid-svg-icons';

function PurchasesTable() {
  const purchases = useSelector((state) => state.userReducer).purchased;
  const history = useHistory();

  if (purchases.length === 0) {
    return (
      <div className="empty-box-warning">
        <img src={box} alt="empty box" />
        <p className="empty-cart-caption">You have not purchased anything yet.. :c</p>
      </div>
    );
  }

  return (
    <Table celled inverted selectable className="purchases-table">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>TITLE</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">BPM</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Scale</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Date</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Price</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">License Type</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Links</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {purchases.map((item, index) => {
          const dateObj = new Date(item.date);
          const month = dateObj.getUTCMonth() + 1; // months from 1-12
          const day = dateObj.getUTCDate();
          const year = dateObj.getUTCFullYear();

          const date = `${year}/${month}/${day}`;

          const imageUrl = process.env.REACT_APP_BACKEND_ASSET_URL + item.imgUrl;

          return (
            <Table.Row key={item.beatId + item.licenseId + item.orderId + index} className="purchased-item">
              <Table.Cell textAlign="left">
                <Label className="label" ribbon>
                  <img src={imageUrl} alt="cover" />
                </Label>
                {item.title}
              </Table.Cell>
              <Table.Cell textAlign="center">{item.bpm}</Table.Cell>
              <Table.Cell textAlign="center">{item.scale}</Table.Cell>
              <Table.Cell textAlign="center">{date}</Table.Cell>
              <Table.Cell textAlign="center" className="price-item">
                {item.price}$
              </Table.Cell>
              <Table.Cell textAlign="center">{item.label}</Table.Cell>
              <Table.Cell textAlign="center">
                <Dropdown
                  className="drop-down"
                  text="Files"
                  icon={<FontAwesomeIcon className="icon" icon={faAngleDown} />}
                  direction="left"
                  key={`${item.beatId + item.licenseId + item.orderId + index}menu`}
                >
                  <Dropdown.Menu className="menu">
                    {item.links.map((link, lIndex) => (
                      <Dropdown.Item
                        key={link.label + lIndex + item.beatId + item.licenseId + item.orderId}
                        icon={<FontAwesomeIcon className="icon" icon={faFileDownload} />}
                        text={link.label}
                        onClick={() => window.open(link.url, '_blank')}
                      />
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}

export default PurchasesTable;
