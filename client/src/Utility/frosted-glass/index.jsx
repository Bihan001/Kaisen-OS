import { useContext } from 'react';
import { ThemeContext } from '../../Contexts/ThemeContext/ThemeContext';
import { WallpaperContext } from '../../Contexts/WallpaperContext';
import './frosted-glass.scss';

const formatColor = (color, hexOpacity) => {
  if (color.indexOf('#') < 0 - 1) return color; // Not a hex code
  if (color.length !== 7) return color; // invalid or already transparency applied
  return color + hexOpacity;
};

const FrostedGlass = ({ frostId, opacityHex, showMargin = true }) => {
  const { theme } = useContext(ThemeContext);
  const { wallpaper } = useContext(WallpaperContext);
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: [
          `#${frostId || 'default_id'}::before {`,
          `box-shadow: inset 0 0 2000px ${formatColor(theme, opacityHex || '88')} ;`,
          // `background-image: url(${wallpaper});`,
          `filter: drop-shadow(0px 0px 10px ${formatColor(theme, '11')});`,
          `margin: ${!!showMargin ? '-20px' : '0px'};`,
          '}',
        ].join('\n'),
      }}></style>
  );
};

export default FrostedGlass;
