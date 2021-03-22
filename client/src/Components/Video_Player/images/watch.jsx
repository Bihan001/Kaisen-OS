import React, { Fragment, useEffect, useState, useRef } from "react";
import { Button, Spinner } from "react-bootstrap";
import io from "socket.io-client";
import Notification from "./notification";
import PlayLogo from "./images/play-button.svg";
import PauseLogo from "./images/pause.svg";
import FullScreenLogo from "./images/full-screen.svg";
import VolumeLogo from "./images/volume.svg";
import MuteLogo from "./images/mute.svg";
import SearchAnime from "./search-anime";
let socket;
let isFullScreen = false;
let videoControlsTimer;

const WEB_URL = "https://gogoanime.sh/";

const Watch = ({ match }) => {
  //States ---------------------
  const [anime, setAnime] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAllReady, setAllReady] = useState(false);
  const [websiteURL, setWebsiteURL] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [isWebsiteURLLocked, setWebsiteURLLocked] = useState(false);
  const [isVideoLoading, setVideoLoading] = useState(false);
  const [currentTimeMins, setCurrentTimeMins] = useState("0");
  const [currentTimeSecs, setCurrentTimeSecs] = useState("0");
  const [isInitialVideoLoadReady, setInitialVideoLoadReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [joinedInMiddle, setJoinedInMiddle] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const videoPlayerRef = useRef(null);
  const videoRef = useRef(null);

  //--------------------------

  useEffect(() => {
    socket = io("/");
    socket.emit("onNewJoin", match.params.room);
    socket.on("otakuJoined", (msg) =>
      setNotifications((notifications) => [
        ...notifications,
        createNotification("success", "New User", msg),
      ])
    );
    socket.on("otakuDisconnected", () =>
      setNotifications((notifications) => [
        ...notifications,
        createNotification("warning", "User left", "One otaku left the room"),
      ])
    );
    socket.on("serverError", (msg) => {
      setJoinedInMiddle(false);
      setVideoLoading(false);
      setWebsiteURLLocked(false);
      setNotifications((notifications) => [
        ...notifications,
        createNotification(
          "error",
          "Server Error",
          "Cannot process this video, try another link"
        ),
      ]);
    });
    socket.on("linkAdded", (msg) => {
      setWebsiteURLLocked(true);
      setVideoLoading(true);
      console.log(msg);
    });
    socket.on("videoFound", (videoURL) => {
      setJoinedInMiddle(false);
      setVideoLoading(false);
      console.log(videoURL);
      setVideoURL(videoURL);
      setWebsiteURLLocked(false);
      // Put videoURL into video.srcObject, then
    });
    socket.on("allUsersReady", (msg) => {
      if (videoRef && videoRef.current) videoRef.current.play();
      console.log(msg);
      setNotifications((notifications) => [
        ...notifications,
        createNotification("success", "Ready", msg),
      ]);
      setAllReady(true);
    });
    socket.on("playVideo", () => {
      if (videoRef && videoRef.current) {
        videoRef.current.play();
        setAllReady(true);
      }
    });
    socket.on("pauseVideo", () => {
      if (videoRef && videoRef.current) {
        videoRef.current.pause();
        setAllReady(false);
      }
    });
    socket.on("clientSeekedVideo", (currentTime) => {
      if (videoRef && videoRef.current) {
        videoRef.current.currentTime = currentTime;
      }
    });
    socket.on("ongoingVideoFound", (videoURL) => {
      setJoinedInMiddle(true);
      setVideoLoading(false);
      setVideoURL(videoURL);
    });
    socket.on("requestCurrentVideoTime", () => {
      if (videoRef && videoRef.current)
        socket.emit("seekedVideo", videoRef.current.currentTime);
    });
  }, []);

  useEffect(() => {
    if (joinedInMiddle === false) {
      socket.emit("videoReady");
    } else if (joinedInMiddle === true) {
      socket.emit("ongoingVideoReady");
    }
  }, [isInitialVideoLoadReady]);

  // Handler Functions -------------------

  const createNotification = (type, heading, body) => {
    const randomId = Date.now().toString() + Math.round(Math.random() * 1000);
    setTimeout(() => {
      setNotifications((notifications) =>
        notifications.filter((n) => n.id !== randomId)
      );
    }, 5000);
    return {
      id: randomId,
      type,
      heading,
      body,
    };
  };

  const handleSeekBar = (e) => {
    console.log(e);
    let rect = document
      .querySelector("#custom-seekbar")
      .getBoundingClientRect();
    let offset = {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    };
    let left = e.pageX - offset.left;
    let totalWidth = parseFloat(
      getComputedStyle(
        document.querySelector("#custom-seekbar"),
        null
      ).width.replace("px", "")
    );
    let percentage = left / totalWidth;
    let vidTime = videoRef.current.duration * percentage;
    videoRef.current.currentTime = vidTime;
    socket.emit("seekedVideo", vidTime);
  };

  const handleSeekBarUpdate = () => {
    let percentage =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    document.querySelector("#custom-seekbar span").style.width =
      percentage + "%";
    setCurrentTimeMins(
      Math.floor(videoRef.current.currentTime / 60) < 10
        ? "0" + Math.floor(videoRef.current.currentTime / 60)
        : Math.floor(videoRef.current.currentTime / 60)
    );

    setCurrentTimeSecs(
      Math.floor(videoRef.current.currentTime - currentTimeMins * 60) < 10
        ? "0" + Math.floor(videoRef.current.currentTime - currentTimeMins * 60)
        : Math.floor(videoRef.current.currentTime - currentTimeMins * 60)
    );
  };

  const handleWebsiteURLChange = (e) => {
    setWebsiteURL(e.target.value);
  };

  const handleWebsiteURLSubmit = (manualWebsiteLink = "") => {
    if (!isWebsiteURLLocked) {
      setInitialVideoLoadReady(false);
      socket.emit("newLink", manualWebsiteLink || websiteURL);
    } else {
      setNotifications((notifications) => [
        ...notifications,
        createNotification(
          "error",
          "Error",
          "Video already submitted by another user and is in process"
        ),
      ]);
    }
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
      document.querySelector(".player").requestFullscreen();
    }
  };

  const handleMouseMoveInVideo = (e) => {
    let pc = document.querySelector(".player_controls");
    if (pc) {
      pc.style.opacity = 1;
      let player = document.getElementById("player");
      if (player) player.style.cursor = "default";
    }
    clearTimeout(videoControlsTimer);
    videoControlsTimer = setTimeout(() => {
      if (pc) pc.style.opacity = 0;
      let player = document.getElementById("player");
      if (player) player.style.cursor = "none";
    }, 3000);
  };

  const handlePlayReq = () => {
    console.log("playing now");
    socket.emit("playVideoReq");
  };

  const handlePauseReq = () => {
    console.log("pausing now");
    socket.emit("pauseVideoReq");
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
        console.log("Unmute");
        videoRef.current.volume = 1;
        setIsMuted(false);
      } else {
        console.log("Mute");
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handlePausePlay = () => {
    if (videoRef && videoRef.current) {
      if (videoRef.current.paused) {
        handlePlayReq();
      } else {
        handlePauseReq();
      }
      console.log(videoRef.current.paused);
    }
  };

  const handlePrevious = () => {
    handleWebsiteURLSubmit(WEB_URL + anime.episode_id[currentIndex - 1]);
    setCurrentIndex(currentIndex - 1);
  };
  const handleNext = () => {
    handleWebsiteURLSubmit(WEB_URL + anime.episode_id[currentIndex + 1]);
    setCurrentIndex(currentIndex + 1);
  };
  // Actual HTML Rendering ------------------------

  return isVideoLoading ? (
    <div className="container-md">
      <div className="loader-spinner-wrapper">
        <Spinner variant="info" animation="border" className="loader-spinner" />
      </div>
    </div>
  ) : (
    <div className="container-fluid" style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        {notifications.map((n, idx) => (
          <Notification
            key={idx}
            type={n.type}
            heading={n.heading}
            body={n.body}
          />
        ))}
      </div>
      <div className="container py-4 anime-container">
        <div className="anime-search-box">
          <div className="d-flex align-items-center" style={{ width: "100%" }}>
            <input
              type="text"
              placeholder="Put anime website URL"
              className="mx-2 anime-input"
              value={websiteURL}
              onChange={(e) => handleWebsiteURLChange(e)}
            />
            <Button
              variant="outline-info"
              className="anime-search-btn"
              onClick={(e) => {
                e.preventDefault();
                setWebsiteURL("");
                handleWebsiteURLSubmit();
              }}
            >
              GO!
            </Button>
          </div>
          <SearchAnime
            handleWebsiteURLSubmit={handleWebsiteURLSubmit}
            anime={anime}
            setAnime={setAnime}
            setCurrentIndex={setCurrentIndex}
          />
        </div>
        <p className="users-status-msg display-4" style={{ fontWeight: 400 }}>
          <span>Room ID:</span>
          {" " + match.params.room}
        </p>
        <p className="users-status-msg display-4">
          {isAllReady ? "All Ready!" : "Wait for others!"}
        </p>
        <div className="d-flex justify-content-between navbar-buttons-box">
          <Button
            onClick={(e) => handlePrevious(e)}
            variant="outline-info"
            disabled={!anime || !anime.episode_id || currentIndex <= 0}
            style={{
              cursor:
                !anime || !anime.episode_id || currentIndex <= 0
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Previous
          </Button>
          <Button
            onClick={(e) => handleNext(e)}
            variant="outline-info"
            disabled={
              !anime ||
              !anime.episode_id ||
              currentIndex >= anime.episode_id.length - 1
            }
            style={{
              cursor:
                !anime ||
                !anime.episode_id ||
                currentIndex >= anime.episode_id.length - 1
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Next
          </Button>
        </div>
        <div
          onMouseMove={(e) => handleMouseMoveInVideo(e)}
          ref={videoPlayerRef}
          className="player"
          id="player"
          onDoubleClick={handleFullScreen}
        >
          <div onClick={handlePausePlay} className="video">
            <video
              onCanPlay={(e) => setInitialVideoLoadReady(true)}
              onWaiting={(e) => handlePauseReq(e)}
              // onSeeked={(e) => handleSeeked(e)}
              onTimeUpdate={(e) => handleSeekBarUpdate(e)}
              ref={videoRef}
              style={{ width: "100%", height: "100%", pointerEvents: "none" }}
              src={videoURL}
            />
          </div>

          <div className="player_controls">
            <div id="custom-seekbar" onClick={(e) => handleSeekBar(e)}>
              <span></span>
            </div>
            <div className="player-controls-buttons">
              <div className="video-play-pause">
                {videoRef && videoRef.current && videoRef.current.paused ? (
                  <button
                    onClick={(e) => handlePlayReq(e)}
                    className="play_button"
                    disabled={!isInitialVideoLoadReady}
                    style={{
                      cursor: isInitialVideoLoadReady
                        ? "default"
                        : "not-allowed",
                    }}
                  >
                    <img src={PlayLogo} height="30px" width="30px" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => handlePauseReq(e)}
                    className="play_button"
                    disabled={!isInitialVideoLoadReady}
                    style={{
                      cursor: isInitialVideoLoadReady
                        ? "default"
                        : "not-allowed",
                    }}
                  >
                    <img src={PauseLogo} height="30px" width="30px" />
                  </button>
                )}
                <div className="play_button_time">
                  {currentTimeMins + ":" + currentTimeSecs}
                </div>
              </div>
              <div className="d-flex align-items-center">
                <button onClick={handleVolumeMute} className="play_button_mute">
                  {isMuted ? (
                    <img src={MuteLogo} height="30px" width="30px" />
                  ) : (
                    <img src={VolumeLogo} height="30px" width="30px" />
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
                  }}
                ></input>
                <button
                  onClick={(e) => handleFullScreen(e)}
                  className="play_button_fullscreen"
                >
                  <img src={FullScreenLogo} height="30px" width="30px" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
