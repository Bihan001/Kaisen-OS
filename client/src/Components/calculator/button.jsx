import React, { useContext } from 'react';
import { ThemeContext } from '../../Contexts/ThemeContext/ThemeContext';

const ButtonComponent = (props) => {
  const { theme } = useContext(ThemeContext);

  return (
    <button className="button-style" style={{ color: theme }} onClick={() => props.handleClick(props.children)}>
      {props.children}
    </button>
  );
};

export default ButtonComponent;
