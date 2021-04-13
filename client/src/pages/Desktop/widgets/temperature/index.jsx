import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './temperature.scss';

const weatherApiKey = 'e4e40b8ea4e6a131dddcdadd76d89036';

// Not working, should work: dd96ec894ec655442a773e09c19b9b34

const Temperature = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    getCurrentLocation(fetchWeather);
  }, []);

  const getCurrentLocation = (cb) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => cb(pos),
      (err) => console.log(err)
    );
  };

  const fetchWeather = async (pos) => {
    try {
      const { latitude, longitude } = pos.coords;
      let res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherApiKey}&units=metric`,
        { withCredentials: false }
      );
      console.log(res.data);
      setWeather(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="thermometer">
      <div>
        <span className="glass">
          <span className="amount" style={{ height: weather ? `${weather.main.temp}%` : '0%' }} />
        </span>
        <div className="bulb">
          <div>
            <span className="red-circle" />
            {/* <span className="filler">
            <span />
          </span> */}
          </div>
        </div>
      </div>
      <div className="total-temp">
        <strong style={{ lineHeight: '4.7rem' }}>{weather?.main.temp || '0° C'}</strong>
        <strong style={{ fontSize: '1.5rem' }}>{weather?.name || ''}</strong>
        <strong style={{ fontSize: '1.5rem' }}>Min: {weather?.main.temp_min || '0° C'}</strong>
        <strong style={{ fontSize: '1.5rem' }}>Max: {weather?.main.temp_max || '0° C'}</strong>
      </div>
    </div>
  );
};

export default Temperature;
