import React, { useContext, useState } from 'react';
import axios from 'axios';
import firebase from '../../firebase';
import { AuthContext } from '../../Contexts/AuthContext';
import './Login.scss';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleIcon from '../../assets/icons/035-google-plus.svg';
import FacebookIcon from '../../assets/icons/045-facebook.svg';
import GithubIcon from '../../assets/icons/039-github.svg';
import LinkedinIcon from '../../assets/icons/031-linkedin.svg';

const Login = (props) => {
  const { setUser } = useContext(AuthContext);

  const [inView, setInView] = useState(false);

  const handleLogin = async (provider) => {
    try {
      const res = await firebase.auth().signInWithPopup(provider);
      const idToken = await res.user.getIdToken();
      const userRes = await axios.post('http://localhost:5000/api/auth/sessionLogin', { idToken });
      setUser(userRes.data.data);
      firebase.auth().signOut(); 
      props.history.push('/');
    } catch (err) {
      console.log(err);
    }
  };

  const loginWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    handleLogin(provider);
  };

  const loginWithFacebook = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    handleLogin(provider);
  };

  const loginWithGithub = () => {
    const provider = new firebase.auth.GithubAuthProvider();
    handleLogin(provider);
  };

  const loginWithLinkedin = () => {};

  return (
    <div className="login">
      <AnimatePresence>
        {!inView ? (
          <motion.img
            id="login-button"
            key="loginbtn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="login__image"
            src="https://dqcgrsy5v35b9.cloudfront.net/cruiseplanner/assets/img/icons/login-w-icon.png"
            onClick={() => setInView(true)}
          />
        ) : (
          <motion.div
            key="loginbox"
            transition={{ delay: 0.5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="login-container">
            <h1>First things first</h1>
            {/* <span className="close-btn" onClick={() => setInView(false)}>
              <img src="https://cdn4.iconfinder.com/data/icons/miu/22/circle_close_delete_-128.png" />
            </span> */}
            <div className="login__box">
              <button onClick={loginWithGoogle}>
                <img src={GoogleIcon} />
              </button>
              <button onClick={loginWithFacebook}>
                <img src={FacebookIcon} />
              </button>
              <button onClick={loginWithGithub}>
                <img src={GithubIcon} />
              </button>
              <button onClick={loginWithLinkedin}>
                <img src={LinkedinIcon} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Login;
