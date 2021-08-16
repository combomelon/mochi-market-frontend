import React, { useEffect, useState } from "react";
import { Card, Row, Col, Popover } from 'antd';
import imgNotFound from 'Assets/notfound.png';
import { getCollection } from 'store/actions';
import store from 'store/index';
import { getDetailNFT } from 'APIs/NFT/Get';
import { useHistory } from 'react-router-dom';
import { getSymbol } from 'utils/getContractAddress';
import moment from 'moment';
import tick from 'Assets/icons/tick-green.svg';
import { handleChildClick, objToString } from 'utils/helper';
import { isArray } from 'lodash';

const __NFTCardLoader = () => {
  return (
    <Card
      className='card-nft card-nft-content-loader'
      cover={
        <div className='wrap-cover'>
          <div className='NFTResource-Wrapper'>
            <img
              className='display-resource-nft'
              src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
              alt=''
            />
          </div>
        </div>
      }
    >
      <Row justify='space-between'>
        <Col className='footer-card-left'>
          <div className='name-collection'>&nbsp;</div>
          <div className='name-nft'>&nbsp;</div>
        </Col>
      </Row>
    </Card>)
}

export const __NFTCardDetail = ({ chainId, token, detailNFT, collectionName, verifiedContracts }) => {
  const history = useHistory()
  const collectionUrl = `/collection/${chainId}/${token.collectionAddress}`
  const itemUrl = `/token/${chainId}/${token.collectionAddress}/${token.tokenId}/${token.sellId}`
  const onClick = (event) => {
    event.preventDefault();
    let eventTarget = event.target;
    history.push(
      eventTarget.matches("span.link-collection-name") ? collectionUrl : itemUrl
    )
  }
  return (
    <a href={itemUrl} onClick={onClick}>
      <Card
        hoverable
        cover={
          <div className='wrap-cover'>
            <div
              className='blurred-background'
              style={{
                backgroundImage: `url(${token.thumb !== 'none' ? token.thumb : detailNFT.image})`,
              }}
            />
            <div className='NFTResource-Wrapper'>
              <img
                alt={`img-nft-${token.tokenId}`}
                src={token.thumb !== 'none' ? token.thumb : detailNFT.image}
                className='display-resource-nft'
              />
            </div>
          </div>
        }
        className='card-nft'
      >
        {!!token.attributes && token.attributes.length > 0 && (
          <Popover
            onClick={handleChildClick}
            placement='bottomLeft'
            content={token.attributes.map((attr, i) => (
              <div key={i} onClick={handleChildClick}>
                <strong>{attr.trait_type}</strong>:{' '}
                {isArray(attr.value)
                  ? attr.value.join(', ')
                  : !!attr.display_type &&
                    attr.display_type.toLowerCase() === 'date' &&
                    !!moment(attr.value).isValid()
                    ? moment(
                      attr.value.toString().length < 13 ? attr.value * 1000 : attr.value
                    ).format('DD-MM-YYYY')
                    : typeof attr.value === 'object'
                      ? objToString(attr.value)
                      : attr.value}
              </div>
            ))}
          >
            <div className='attribs-nft' onClick={handleChildClick}>
              Stats
            </div>
          </Popover>
        )}
        {!!token.price && (
          <div className='price-nft textmode'>
            <span>{token.price}</span> <b>{getSymbol(chainId)[token.token]}</b>
          </div>
        )}
        <Row justify='space-between'>
          <Col className='footer-card-left'>
            <div className='name-collection'>
              <span
                className='link-collection-name'
                tag='span'
              >
                {collectionName || token.nameCollection}
              </span>
              {
                verifiedContracts.includes(token.collectionAddress.toLocaleLowerCase()) && (
                  <img src={tick} alt='icon-tick' className='icon-tick' />
                )
              }
            </div>
            <div className='name-nft textmode'>
              {token.name || detailNFT.name}
            </div>
          </Col>
        </Row>
      </Card>
    </a>
  )
}

export const useDetailNFT = (chainId, token,) => {
  const [detailNFT, setDetailNFT] = useState(null);
  useEffect(() => {
    async function fetchDetail() {
      if (!token) return setDetailNFT({ name: '', description: '', image: imgNotFound });
      try {
        let nft = await getDetailNFT(chainId, token.collectionAddress, token.tokenId);
        if (!nft.name || nft.name === 'Unnamed') nft.name = 'ID: ' + token.tokenId;
        token.nameCollection = (
          await store.dispatch(getCollection(token.collectionAddress, null))
        ).collection.name;
        setDetailNFT(nft);
      }
      catch (error) {
        setDetailNFT({ name: 'Unnamed', description: '', image: imgNotFound });
      }
    }
    fetchDetail();
  }, [chainId, token]);
  return detailNFT;
}

export const NFTCardLoader = React.memo(__NFTCardLoader)
export const NFTCardDetail = React.memo(__NFTCardDetail)