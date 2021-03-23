import React, { useContext } from 'react';
import './Loader.scss';
import { ThemeContext } from '../../Contexts/ThemeContext/ThemeContext';
const Loader = () => {
  const { theme } = useContext(ThemeContext);
  let styleObj = {
    border: `8px solid ${theme}`,
    borderColor: `${theme} transparent transparent transparent`,
  };
  return (
    <div className="lds-ring">
      <div style={styleObj}></div>
      <div style={styleObj}></div>
      <div style={styleObj}></div>
      <div style={styleObj}></div>
    </div>
  );
};
export default Loader;
