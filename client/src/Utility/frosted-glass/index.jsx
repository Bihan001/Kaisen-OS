import { useContext } from 'react';
import { ThemeContext } from '../../Contexts/ThemeContext/ThemeContext';
import { WallpaperContext } from '../../Contexts/WallpaperContext';
import './frosted-glass.scss';

const FrostedGlass = ({ frostId, opacityHex, showMargin = true }) => {
  const { theme } = useContext(ThemeContext);
  const { wallpaper } = useContext(WallpaperContext);
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: [
          `#${frostId || 'default_id'}::before {`,
          `box-shadow: inset 0 0 2000px ${theme}${opacityHex || '88'} ;`,
          // `background-image: url(${wallpaper});`,
          `margin: ${!!showMargin ? '-20px' : '0px'};`,
          '}',
        ].join('\n'),
      }}></style>
  );
};

export default FrostedGlass;
