import cover from 'Assets/banners/cover.png';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { setStrSearch } from 'store/actions';
import { useDispatch } from 'react-redux';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';

export default function BannerSearchHome({ carouselBanner, inputSearch }) {
  const dispatch = useDispatch();
  const searchNFT = (text) => {
    dispatch(setStrSearch(text));
  };

  return (
    <div className='banner-search-home'>
      <Slider {...carouselBanner} className='carousel-banner-home'>
        <div className='home-banner'>
          <img src={cover} alt='cover' />
          <div className='banner-content center'>
            <div>
              <p className='fontRubik mc-mk'>MOCHI MARKET</p>
              <p className='fontRoboto new-eco'>THE NEW CREATIVE ECONOMY</p>
            </div>
          </div>
        </div>
      </Slider>
      {/* Search box */}
      <div className='box-search'>
        <div className='center' style={{ width: '100%', position: 'absolute', top: '-2rem' }}>
          <div className='hs'>
            <div
              className='search-icon center search-input'
              style={{
                height: '3rem',
                width: '3rem',
                borderRadius: '16px 0px 0px 16px',
                background: '#ffffff',
              }}
            >
              <SearchOutlined />
            </div>
            <Link to='/browse'>
              <input
                className='search-input home-search'
                placeholder='Search'
                ref={inputSearch}
                onChange={(e) => searchNFT(e.target.value)}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}