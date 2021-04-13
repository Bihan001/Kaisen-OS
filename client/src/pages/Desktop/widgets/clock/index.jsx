import React, { useEffect, useState } from 'react';
import './clock.scss';

const weeks = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const zeroPadding = (num, digit) => {
  let zero = '';
  for (let i = 0; i < digit; i++) {
    zero += '0';
  }
  return (zero + num).slice(-digit);
};

const Clock = () => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    updateTime();
    const timerID = setInterval(updateTime, 1000);
    return () => clearInterval(timerID);
  }, []);

  const updateTime = () => {
    let cd = new Date();

    setTime(
      zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2)
    );
    setDate(
      zeroPadding(cd.getFullYear(), 4) +
        '-' +
        zeroPadding(cd.getMonth() + 1, 2) +
        '-' +
        zeroPadding(cd.getDate(), 2) +
        ' ' +
        weeks[cd.getDay()]
    );
  };

  return (
    <div id="clock">
      <p className="date">{date}</p>
      <p className="time">{time}</p>
    </div>
  );
};

export default Clock;
