import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { backendUrl } from '../../../backendUrl';
import { Folder, File, ClassFolder, ClassFile } from '../../../Classes/Classes';
import arrow from '../../../assets/icons/arrow.png';
import powerOff from '../../../assets/icons/power-button.png';
import alan_ai_icon from '../../../assets/icons/alan_ai.png';
import Temperature from '../widgets/temperature';
import './start-menu.scss';
import Clock from '../widgets/clock';
import FrostedGlass from '../../../Utility/frosted-glass';
import { NotificationContext } from '../../../Contexts/NotificationContext';

const StartMenu = (props) => {
  const {
    showMenu,
    user,
    setUser,
    wallpapers,
    presentWallpaper,
    setPresentWallpaper,
    handleOpen,
    handleIcon,
    maxZindex,
    theme,
  } = props;

  const { addNotification } = useContext(NotificationContext);

  const [startMenuContents, setStartMenuContents] = useState({
    folders: [],
    files: [],
  });

  useEffect(() => {
    getStartMenuContents();
  }, []);

  const getStartMenuContents = async () => {
    const body = {
      filePaths: ['root#terminal.exe', 'root#public#rock#newTextFile.txt', 'root#demo.txt', 'root#demo2.txt'],
      folderPaths: ['root#public', 'root#ankur', 'root#bihan'],
    };

    const res = await axios.post(`${backendUrl}/api/folders/getFilesAndFolders`, body);

    console.log('/getFilesAndFolders : ', res);

    setStartMenuContents({
      folders: res.data.data.folderResultList.map((data) => {
        return new ClassFolder(
          data.name,
          data.dateCreated,
          data.dateModified,
          data.editableBy,
          data.path,
          data.type,
          data.children
        );
      }),
      files: res.data.data.fileResultList.map((data) => {
        return new ClassFile(
          data.name,
          data.dateCreated,
          data.dateModified,
          data.editableBy,
          data.path,
          data.type,
          data.content
        );
      }),
    });
  };

  const handleWallpaperLeft = () => {
    setPresentWallpaper((idx) => (wallpapers[idx - 1] ? idx - 1 : wallpapers.length - 1));
  };

  const handleWallpaperRight = () => {
    setPresentWallpaper((idx) => (wallpapers[idx + 1] ? idx + 1 : 0));
  };

  const logout = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/auth/sessionLogout`);
      setUser(null);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  if (!showMenu || !user) return <></>;
  return (
    <div className="Start_Menu Frosted_Glass" id="start-menu" style={{ zIndex: maxZindex }}>
      <FrostedGlass frostId="start-menu" opacityHex="ff" />
      <div className="Info_n_Content">
        <div className="User_Info">
          <div className="dp_div">
            <img src={user.displayImage} />
          </div>
          <div className="User_Name">{user.name}</div>
        </div>
        <div className="StartMenu__Content StartMenu__Content__Scrollable">
          {startMenuContents.folders.map((content, idx) => (
            <div key={idx} className="StartMenu__Content__Data" onClick={() => handleOpen(content)}>
              <img src={handleIcon(content)} />
              <div>{content.name}</div>
            </div>
          ))}
          {startMenuContents.files.map((content, idx) => (
            <div key={idx} className="StartMenu__Content__Data" onClick={() => handleOpen(content)}>
              <img src={handleIcon(content)} />
              <div>{content.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="Wallpaper_n_Widgets">
        <div className="Wallpaper_n_Widgets__Top">
          <div>{wallpapers.length > 0 && <img src={wallpapers[presentWallpaper].image} />}</div>
          <div className="Left" onClick={handleWallpaperLeft}>
            <img src={arrow} />
          </div>
          <div className="Right" onClick={handleWallpaperRight}>
            <img src={arrow} />
          </div>
        </div>
        <div className="Wallpaper_n_Widgets__Bottom">
          <Temperature />
          <div className="Wallpaper_n_Widgets__Bottom__right-top">
            <Clock />
            <div className="Wallpaper_n_Widgets__Bottom__right-top__buttons">
              <button className="start-button logout" onClick={() => logout()}>
                <img src={powerOff} />
              </button>
              <button
                className="start-button ai"
                onClick={() => {
                  addNotification('info', 'AI', 'Feature Coming Soon !');
                }}>
                {' '}
                <img src={alan_ai_icon} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
