import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeinTop, slideOutLeft } from '../../../Utility/functions';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
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
import { ScreenContext } from '../../../Contexts/ScreenContext';
import WallpaperGridIcon from '../../../assets/icons/036-photo.svg';

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
  const { screenState } = useContext(ScreenContext);

  const [startMenuContents, setStartMenuContents] = useState({
    folders: [],
    files: [],
  });

  const [showWallpaperGrid, setShowWallpaperGrid] = useState(false);

  //Carousal config============
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  //===========================

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
      {!screenState.mobileView && (
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
                    <button className="wallpapers-grid-button" onClick={(e) => setShowWallpaperGrid((s) => !s)}>
                      <img src={WallpaperGridIcon} style={{ width: '100%', height: '100%' }} />
                    </button>
                    {wallpapers.length > 0 && (
                      <AnimatePresence exitBeforeEnter>
                        {showWallpaperGrid && (
                          <motion.div
                            className="wallpapers-grid"
                            variants={slideOutLeft}
                            initial="hidden"
                            animate="visible"
                            exit="exit">
                            {wallpapers.map((wallpaper, idx) => (
                              <img
                                loading="lazy"
                                className="wallpapers-grid-img"
                                src={wallpaper.image}
                                onClick={(e) => setPresentWallpaper(idx)}
                              />
                            ))}
                          </motion.div>
                        )}
                        {!showWallpaperGrid && (
                          <motion.img
                            src={wallpapers[presentWallpaper].image}
                            variants={slideOutLeft}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            key={wallpapers[presentWallpaper].image}
                          />
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                  {!showWallpaperGrid && (
                    <div className="Left" onClick={handleWallpaperLeft}>
                      <img src={arrow} />
                    </div>
                  )}
                  {!showWallpaperGrid && (
                    <div className="Right" onClick={handleWallpaperRight}>
                      <img src={arrow} />
                    </div>
                  )}
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
      )}
      {screenState.mobileView && (
        <AnimatePresence>
          {showMenu && (
            <motion.div
              className="Mobile_Start_Menu Frosted_Glass"
              id="start-menu-mobile"
              key="start-menu-mobile"
              style={{
                zIndex: maxZindex,
                width: '100vw',
                height: screenState.screenHeight - 4.8 * (screenState.screenWidth > 415 ? 10 : 7) + 'px',
              }}
              ref={clickedOutsideRef}
              variants={fadeinTop}
              initial="hidden"
              animate="visible"
              exit="exit">
              <FrostedGlass frostId="start-menu-mobile" opacityHex="ff" />
              <div className="Mobile_Start_Menu__Info">
                <div className="User_Info">
                  <div className="dp_div">
                    <img src={user.displayImage} />
                  </div>
                  <div className="User_Name">{user.name}</div>
                </div>
                <motion.div className="Wallpaper" variants={fadeinTop}>
                  <div>
                    <button className="wallpapers-grid-button" onClick={(e) => setShowWallpaperGrid((s) => !s)}>
                      <img src={WallpaperGridIcon} style={{ width: '100%', height: '100%' }} />
                    </button>
                    {wallpapers.length > 0 && (
                      <AnimatePresence exitBeforeEnter>
                        {showWallpaperGrid && (
                          <motion.div
                            className="wallpapers-grid"
                            variants={slideOutLeft}
                            initial="hidden"
                            animate="visible"
                            exit="exit">
                            {wallpapers.map((wallpaper, idx) => (
                              <img
                                loading="lazy"
                                className="wallpapers-grid-img"
                                src={wallpaper.image}
                                onClick={(e) => setPresentWallpaper(idx)}
                              />
                            ))}
                          </motion.div>
                        )}
                        {!showWallpaperGrid && (
                          <motion.img
                            src={wallpapers[presentWallpaper].image}
                            variants={slideOutLeft}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            key={wallpapers[presentWallpaper].image}
                          />
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                  {!showWallpaperGrid && (
                    <div className="Left" onClick={handleWallpaperLeft}>
                      <img src={arrow} />
                    </div>
                  )}
                  {!showWallpaperGrid && (
                    <div className="Right" onClick={handleWallpaperRight}>
                      <img src={arrow} />
                    </div>
                  )}
                </motion.div>
              </div>
              <div className="Mobile_Start_Menu__Widgets_n_Content">
                <Carousel responsive={responsive} showDots={true} removeArrowOnDeviceType={['tablet', 'mobile']}>
                  <div className="Mobile_Start_Menu__Widgets_n_Content__Content StartMenu__Content__Scrollable">
                    {startMenuContents.folders.map((content, idx) => (
                      <motion.div key={idx} className="Data" onClick={() => handleOpen(content)} variants={fadeinTop}>
                        <img src={handleIcon(content)} />
                        <div>{content.name}</div>
                      </motion.div>
                    ))}
                    {startMenuContents.files.map((content, idx) => (
                      <motion.div key={idx} className="Data" onClick={() => handleOpen(content)} variants={fadeinTop}>
                        <img src={handleIcon(content)} />
                        <div>{content.name}</div>
                      </motion.div>
                    ))}
                  </div>
                  <div
                    className="Mobile_Start_Menu__Widgets_n_Content__Widgets"
                    style={{ display: 'flex', alignItems: 'center' }}>
                    <Temperature style={{ width: 'fit-content', margin: 0 }} />
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}>
                      <Clock />
                      <div className="mobile-start-btns">
                        <motion.button
                          className="start-button start-button-mobile logout"
                          onClick={() => logout()}
                          variants={fadeinTop}>
                          <img src={powerOff} />
                        </motion.button>
                        <motion.button
                          className="start-button start-button-mobile ai"
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
                </Carousel>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

export default StartMenu;
