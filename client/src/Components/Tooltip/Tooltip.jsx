import React, { useState, useEffect } from 'react';
import './Tooltip.scss';
const Tooltip = ({ isDesktopIcon, showTooltip, tooltipPosition, tooltipData }) => {
  return (
    <>
      {showTooltip && (
        <div
          className="tooltip-box"
          style={{
            transform: `translate(${tooltipPosition.x - (isDesktopIcon ? 0 : 300)}px, ${
              tooltipPosition.y - (isDesktopIcon ? 0 : 100)
            }px)`,
          }}>
          Name: {tooltipData.name}
          <br />
          Type : {tooltipData.type}
          <br />
          Created by: {tooltipData.createdBy}
          <br />
          Date Modified: {tooltipData.dateModified}
        </div>
      )}
    </>
  );
};
export default Tooltip;
