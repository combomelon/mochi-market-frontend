import { Card, Col } from 'antd';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import imgNotFound from 'Assets/notfound.png';
import { getSymbol } from 'utils/getContractAddress';

export default function CardNFTHome({ token, strSearch }) {
  const { web3, chainId } = useSelector((state) => state);
  const [detailNFT, setDetailNFT] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      if (!!token && !!token.tokenURI) {
        try {
          let req = await axios.get(token.tokenURI);
          setDetailNFT(req.data);
        } catch (error) {
          setDetailNFT({ name: 'Unnamed', description: '', image: imgNotFound });
        }
      } else {
        setDetailNFT({ name: '', description: '', image: imgNotFound });
      }
    }
    fetchDetail();
  }, [token, token.tokenURI]);

  return !!detailNFT &&
    (detailNFT.name.toLocaleLowerCase().includes(strSearch.toLowerCase()) ||
      token.collections.toLocaleLowerCase().includes(strSearch.toLowerCase())) ? (
    <Col
      xs={{ span: 24 }}
      sm={{ span: 12 }}
      md={{ span: 8 }}
      lg={{ span: 6 }}
      xl={{ span: 4 }}
      xxl={{ span: 4 }}
    >
      <Link to={`/token/${token.addressToken}/${token.index}`}>
        <Card hoverable cover={<img alt={`img-nft-${token.index}`} src={detailNFT.image} />}>
          <div className='ant-card-meta-title'>{detailNFT.name}</div>
          <div className='ant-card-meta-description textmode'>
            {!!token.price ? (
              `${web3.utils.fromWei(token.price, 'ether')} ${
                getSymbol(chainId)[token.tokenPayment]
              }`
            ) : (
              <></>
            )}
          </div>
        </Card>
      </Link>
    </Col>
  ) : null;
}
