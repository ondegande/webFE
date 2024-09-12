import React, { useState, useEffect } from 'react';
import './Window.css';

function RestaurantWindow() {
  const [theme, setTheme] = useState('A05020100');
  const [restaurants, setRestaurants] = useState([]);

  const KAKAO_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
  const SERVICE_KEY = process.env.REACT_APP_SERVICE_KEY;

  const fetchData = async (cat3) => {
    const response = await fetch(`https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=${SERVICE_KEY}&numOfRows=100&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A&contentTypeId=39&areaCode=6&cat1=A05&cat2=A0502&cat3=${cat3}`);
    const data = await response.json();
    setRestaurants(data.response.body.items.item);
  };

  useEffect(() => {
    fetchData(theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleRestaurantClick = async (placeName) => {
    const query = `${'부산 맛집 '} ${placeName}`;

    const response = await fetch(`https://dapi.kakao.com/v2/search/web?query=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    });
    const data = await response.json();
    
    if (data.documents && data.documents.length > 0) {
      const firstResultUrl = data.documents[0].url;
      window.open(firstResultUrl, '_blank');
    } else {
      alert('검색 결과가 없습니다.');
    }
  };

  return (
    <div>
      <h1>추천 맛집</h1>
      <div className="button-group">
        <button onClick={() => handleThemeChange('A05020100')} className={theme === 'A05020100' ? 'active' : ''}>
          #한식
        </button>
        <button onClick={() => handleThemeChange('A05020200')} className={theme === 'A05020200' ? 'active' : ''}>
          #서양식
        </button>
        <button onClick={() => handleThemeChange('A05020300')} className={theme === 'A05020300' ? 'active' : ''}>
          #일식
        </button>
        <button onClick={() => handleThemeChange('A05020400')} className={theme === 'A05020400' ? 'active' : ''}>
          #중식
        </button>
        <button onClick={() => handleThemeChange('A05020700')} className={theme === 'A05020700' ? 'active' : ''}>
          #이색음식
        </button>
      </div>

      <div className="restaurant-list">
        {restaurants
          .filter((item) => item.firstimage)
          .map((item) => (
            <div key={item.contentid} className="restaurant-item">
              <img
                src={item.firstimage}
                alt={item.title}
                style={{ width: '200px', height: '150px', objectFit: 'cover' }}
              />
              <div className="restaurant-info">
                <h2>
                  {item.title}
                  <button
                    className="info-button"
                    onClick={() => handleRestaurantClick(item.title)}
                    style={{ marginLeft: '10px' }}
                  >
                    알아보기
                  </button>
                </h2>
                <p>{item.addr1}</p>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantWindow;
