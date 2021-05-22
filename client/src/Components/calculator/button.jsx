import React from 'react';

const ButtonComponent = (props) => {
  return (
    <button className="button-style" onClick={() => props.handleClick(props.children)}>
      {props.children}
    </button>
  );
};

export default ButtonComponent;
