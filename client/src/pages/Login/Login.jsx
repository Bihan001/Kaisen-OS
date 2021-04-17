import React, { useContext } from 'react';
import axios from 'axios';
import firebase from '../../firebase';
import { AuthContext } from '../../Contexts/AuthContext';
import './Login.scss';

const Login = (props) => {
  const { setUser } = useContext(AuthContext);

  const loginWithGoogle = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
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

  return (
    <div className="login">
      <button className="login__google" onClick={loginWithGoogle}>
        Login with google
      </button>
    </div>
  );
};
export default Login;
