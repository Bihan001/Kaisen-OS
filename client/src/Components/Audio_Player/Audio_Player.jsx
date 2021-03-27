import React, { useState, useRef, useEffect } from 'react';
import './Audio_Player.scss';
import Loader from '../Loader/Loader';
import PlayLogo from './images/play-button.svg';
import PauseLogo from './images/pause.svg';
import FullScreenLogo from './images/full-screen.svg';
import VolumeLogo from './images/volume.svg';
import MuteLogo from './images/mute.svg';

let audioControlsTimer;

const Audio_Player = ({ content, fullScreen }) => {
  const audioPlayerRef = useRef(null);
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTimeMins, setCurrentTimeMins] = useState('0');
  const [currentTimeSecs, setCurrentTimeSecs] = useState('0');

  const togglePausePlay = () => {
    if (audioRef && audioRef.current) {
      if (audioRef.current.paused) audioRef.current.play();
      else audioRef.current.pause();
    }
  };

  const handleSeekBar = (e) => {
    console.log(e);
    let rect = document.querySelector('#custom-seekbar').getBoundingClientRect();
    let offset = {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    };
    let left = e.pageX - offset.left;
    let totalWidth = parseFloat(
      getComputedStyle(document.querySelector('#custom-seekbar'), null).width.replace('px', '')
    );
    let percentage = left / totalWidth;
    let vidTime = audioRef.current.duration * percentage;
    audioRef.current.currentTime = vidTime;
  };

  const handleSeekBarUpdate = () => {
    let percentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    document.querySelector('#custom-seekbar span').style.width = percentage + '%';
    setCurrentTimeMins(
      Math.floor(audioRef.current.currentTime / 60) < 10
        ? '0' + Math.floor(audioRef.current.currentTime / 60)
        : Math.floor(audioRef.current.currentTime / 60)
    );
    setCurrentTimeSecs(
      Math.floor(audioRef.current.currentTime - currentTimeMins * 60) < 10
        ? '0' + Math.floor(audioRef.current.currentTime - currentTimeMins * 60)
        : Math.floor(audioRef.current.currentTime - currentTimeMins * 60)
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
      document.querySelector('.player').requestFullscreen();
    }
  };

  const handleMouseMoveInAudio = (e) => {
    let pc = document.querySelector('.player_controls');
    if (pc) {
      pc.style.opacity = 1;
      let player = document.getElementById('player');
      if (player) player.style.cursor = 'default';
    }
    clearTimeout(audioControlsTimer);
    audioControlsTimer = setTimeout(() => {
      if (pc) pc.style.opacity = 0;
      let player = document.getElementById('player');
      if (player) player.style.cursor = 'none';
    }, 3000);
  };

  const handleVolumeChange = (e) => {
    console.log(e.target.value);
    if (audioRef && audioRef.current) {
      audioRef.current.volume = e.target.value;
      if (audioRef.current.volume == 0) {
        setIsMuted(true);
      } else {
        setIsMuted(false);
      }
    }
  };

  const handleVolumeMute = () => {
    if (audioRef && audioRef.current) {
      if (isMuted) {
        console.log('Unmute');
        audioRef.current.volume = 1;
        setIsMuted(false);
      } else {
        console.log('Mute');
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  useEffect(() => {
    var audio = document.getElementsByTagName('audio')[0];
    console.log('yayyy');
    audio.src = content;
    audio.load();
    audio.play();
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();

    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 256;

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    function renderFrame() {
      requestAnimationFrame(renderFrame);

      x = 0;

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        var r = barHeight + 25 * (i / bufferLength);
        var g = 250 * (i / bufferLength);
        var b = 50;

        ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }

    audio.play();
    renderFrame();
  }, []);

  return (
    <div className="Audio_Player" style={fullScreen ? { width: '100vw', height: '87vh' } : {}}>
      <Loader />
      <div
        onMouseMove={(e) => handleMouseMoveInAudio(e)}
        ref={audioPlayerRef}
        className="player"
        id="player"
        onDoubleClick={handleFullScreen}>
        <div onClick={togglePausePlay} className="audio">
          <canvas id="canvas"></canvas>
          <audio
            onTimeUpdate={(e) => handleSeekBarUpdate(e)}
            ref={audioRef}
            style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
            src={content}
            autoPlay
            crossOrigin="anonymous"
            // onCanPlay={(e) => showVisualizer(e)}
          />
        </div>

        <div className="player_controls">
          <div id="custom-seekbar" onClick={(e) => handleSeekBar(e)}>
            <span></span>
          </div>
          <div className="player-controls-buttons">
            <div className="audio-play-pause">
              {audioRef && audioRef.current && audioRef.current.paused ? (
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
    </div>
  );
};
export default Audio_Player;
