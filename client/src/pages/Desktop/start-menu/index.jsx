import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeinTop, slideOutLeft } from '../../../Utility/functions';
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
    clickedOutsideRef,
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

  if (!user) return <></>;
  return (
    <>
      <AnimatePresence>
        {showMenu && (
          <motion.div
            className="Start_Menu Frosted_Glass"
            id="start-menu"
            key="start_menu"
            style={{ zIndex: maxZindex }}
            ref={clickedOutsideRef}
            variants={fadeinTop}
            initial="hidden"
            animate="visible"
            exit="exit">
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
                  <motion.div
                    key={idx}
                    className="StartMenu__Content__Data"
                    onClick={() => handleOpen(content)}
                    variants={fadeinTop}>
                    <img src={handleIcon(content)} />
                    <div>{content.name}</div>
                  </motion.div>
                ))}
                {startMenuContents.files.map((content, idx) => (
                  <motion.div
                    key={idx}
                    className="StartMenu__Content__Data"
                    onClick={() => handleOpen(content)}
                    variants={fadeinTop}>
                    <img src={handleIcon(content)} />
                    <div>{content.name}</div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="Wallpaper_n_Widgets">
              <motion.div className="Wallpaper_n_Widgets__Top" variants={fadeinTop}>
                <div>
                  {wallpapers.length > 0 && (
                    <AnimatePresence exitBeforeEnter>
                      <motion.img
                        src={wallpapers[presentWallpaper].image}
                        variants={slideOutLeft}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        key={wallpapers[presentWallpaper].image}
                      />
                    </AnimatePresence>
                  )}
                </div>
                <div className="Left" onClick={handleWallpaperLeft}>
                  <img src={arrow} />
                </div>
                <div className="Right" onClick={handleWallpaperRight}>
                  <img src={arrow} />
                </div>
              </motion.div>
              <div className="Wallpaper_n_Widgets__Bottom">
                <Temperature />
                <div className="Wallpaper_n_Widgets__Bottom__right-top">
                  <Clock />
                  <div className="Wallpaper_n_Widgets__Bottom__right-top__buttons">
                    <motion.button className="start-button logout" onClick={() => logout()} variants={fadeinTop}>
                      <img src={powerOff} />
                    </motion.button>
                    <motion.button
                      className="start-button ai"
                      onClick={() => {
                        addNotification('info', 'AI', 'Feature Coming Soon !');
                      }}
                      variants={fadeinTop}>
                      {' '}
                      <img src={alan_ai_icon} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StartMenu;
