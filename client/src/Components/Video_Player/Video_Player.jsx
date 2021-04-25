import React, { useState, useRef, useContext } from 'react';
import { motion } from 'framer-motion';

import { ScreenContext } from '../../Contexts/ScreenContext';
import { getLayout } from '../../Utility/functions';
import './Video_Player.scss';
import Loader from '../Loader/Loader';
import PlayLogo from './images/play-button.svg';
import PauseLogo from './images/pause.svg';
import FullScreenLogo from './images/full-screen.svg';
import VolumeLogo from './images/volume.svg';
import MuteLogo from './images/mute.svg';

let videoControlsTimer;

const Video_Player = ({ content, id, fullScreen }) => {
  const { screenState } = useContext(ScreenContext);

  const videoPlayerRef = useRef(null);
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTimeMins, setCurrentTimeMins] = useState('0');
  const [currentTimeSecs, setCurrentTimeSecs] = useState('0');

  const convertToUniqueId = (name) => 'lol' + id + '_' + name;

  const getUniqueQuery = (name) => '#' + 'lol' + id + '_' + name;

  const togglePausePlay = () => {
    if (videoRef && videoRef.current) {
      if (videoRef.current.paused) videoRef.current.play();
      else videoRef.current.pause();
    }
  };

  const handleSeekBar = (e) => {
    console.log(e);
    let rect = document.querySelector(getUniqueQuery('custom-seekbar')).getBoundingClientRect();
    let offset = {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    };
    let left = e.pageX - offset.left;
    let totalWidth = parseFloat(
      getComputedStyle(document.querySelector(getUniqueQuery('custom-seekbar')), null).width.replace('px', '')
    );
    let percentage = left / totalWidth;
    let vidTime = videoRef.current.duration * percentage;
    videoRef.current.currentTime = vidTime;
  };

  const handleSeekBarUpdate = () => {
    let percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    document.querySelector(getUniqueQuery('custom-seekbar span')).style.width = percentage + '%';
    setCurrentTimeMins(
      Math.floor(videoRef.current.currentTime / 60) < 10
        ? '0' + Math.floor(videoRef.current.currentTime / 60)
        : Math.floor(videoRef.current.currentTime / 60)
    );
    setCurrentTimeSecs(
      Math.floor(videoRef.current.currentTime - currentTimeMins * 60) < 10
        ? '0' + Math.floor(videoRef.current.currentTime - currentTimeMins * 60)
        : Math.floor(videoRef.current.currentTime - currentTimeMins * 60)
    );
  };

  const handleFullScreen = () => {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => console.log(err));
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen().catch((err) => console.log(err));
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen().catch((err) => console.log(err));
      }
    } else {
      document.querySelector(getUniqueQuery('player')).requestFullscreen();
    }
  };

  const handleMouseMoveInVideo = (e) => {
    let pc = document.querySelector(getUniqueQuery('player_controls'));
    if (pc) {
      pc.style.opacity = 1;
      let player = document.querySelector(getUniqueQuery('player'));
      if (player) player.style.cursor = 'default';
    }
    clearTimeout(videoControlsTimer);
    videoControlsTimer = setTimeout(() => {
      if (pc) pc.style.opacity = 0;
      let player = document.querySelector(getUniqueQuery('player'));
      if (player) player.style.cursor = 'none';
    }, 3000);
  };

  const handleVolumeChange = (e) => {
    console.log(e.target.value);
    if (videoRef && videoRef.current) {
      videoRef.current.volume = e.target.value;
      if (videoRef.current.volume == 0) {
        setIsMuted(true);
      } else {
        setIsMuted(false);
      }
    }
  };

  const handleVolumeMute = () => {
    if (videoRef && videoRef.current) {
      if (isMuted) {
        console.log('Unmute');
        videoRef.current.volume = 1;
        setIsMuted(false);
      } else {
        console.log('Mute');
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  return (
    <motion.div
      className="Video_Player"
      initial={false}
      animate={{ width: getLayout(fullScreen, screenState).width, height: getLayout(fullScreen, screenState).height }}
      transition={{ type: 'spring', stiffness: 300, damping: 35 }}>
      <Loader />
      {/* <iframe src={content} width="100%" height="100%"></iframe> */}
      {/* <video
        src={content}
        width="100%"
        height="100%"
        controls
        autoPlay
        style={{ marginLeft: 'auto', marginRight: 'auto' }}
      /> */}
      <div
        onMouseMove={(e) => handleMouseMoveInVideo(e)}
        ref={videoPlayerRef}
        className="player"
        onMouseOver={(e) => (document.querySelector(getUniqueQuery('custom-seekbar')).style.visibility = 'visible')}
        id={convertToUniqueId('player')}
        onDoubleClick={handleFullScreen}>
        <div onClick={togglePausePlay} className="video">
          <video
            onTimeUpdate={(e) => handleSeekBarUpdate(e)}
            ref={videoRef}
            style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
            src={content}
            autoPlay
          />
        </div>

        <div
          id={convertToUniqueId('player_controls')}
          className="player_controls"
          onMouseOver={(e) => (e.target.style.opacity = 1)}>
          <div
            id={convertToUniqueId('custom-seekbar')}
            style={styles.customSeekbar}
            className="custom-seekbar"
            onClick={(e) => handleSeekBar(e)}>
            <span style={styles.customSeekbarSpan}></span>
          </div>
          <div className="player-controls-buttons">
            <div className="video-play-pause">
              {videoRef && videoRef.current && videoRef.current.paused ? (
                <button onClick={togglePausePlay} className="play_button">
                  <img src={PlayLogo} style={{ width: 25, height: 25 }} />
                </button>
              ) : (
                <button onClick={togglePausePlay} className="play_button">
                  <img src={PauseLogo} style={{ width: 25, height: 25 }} />
                </button>
              )}
              <div className="play_button_time">{currentTimeMins + ':' + currentTimeSecs}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={handleVolumeMute} className="play_button_mute">
                {isMuted ? (
                  <img src={MuteLogo} style={{ width: 25, height: 25 }} />
                ) : (
                  <img src={VolumeLogo} style={{ width: 25, height: 25 }} />
                )}
              </button>
              <input
                type="range"
                name="volume"
                className="player_volume_slider"
                min="0"
                max="1"
                step="0.05"
                onChange={(e) => {
                  handleVolumeChange(e);
                }}></input>
              <button onClick={(e) => handleFullScreen(e)} className="play_button_fullscreen">
                <img src={FullScreenLogo} style={{ width: 25, height: 25 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default Video_Player;

const styles = {
  customSeekbar: {
    margin: '10px auto',
    cursor: 'pointer',
    height: '8px',
    outline: 'thin solid #606669',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  customSeekbarSpan: {
    background: '#ededed',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '10px',
    width: '0px',
  },
};
