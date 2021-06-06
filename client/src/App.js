import { useContext, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from './Contexts/AuthContext';

import Login from './pages/Login/Login';
import Desktop from './pages/Desktop/Desktop';
import { backendUrl } from './backendUrl';
import Notification from './Components/notification';
import { NotificationContext } from './Contexts/NotificationContext';

import './App.css';

const App = () => {
  const { user, setUser } = useContext(AuthContext);
  const { notifications, removeNotification } = useContext(NotificationContext);

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/auth/profile`)
      .then((res) => setUser(res.data.data.user))
      .catch((err) => setUser(null));

    resizeHeightOnMobile();
  }, []);
  const resizeHeightOnMobile = () => {
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    window.addEventListener('resize', () => {
      // We execute the same script as before
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  };
  return (
    <div className="App no-select">
      <div style={{ position: 'absolute', right: 5, bottom: 60, zIndex: 999 }}>
        {Object.keys(notifications).map((key) => (
          <Notification
            key={key}
            id={key}
            type={notifications[key].type}
            heading={notifications[key].heading}
            description={notifications[key].description}
            removeNotification={removeNotification}
          />
        ))}
      </div>
      <Switch>
        {/* <Route exact path='/login' render={(routeProps) => <Login {...routeProps} />} /> */}
        <Route
          exact
          path="/"
          render={(routeProps) => (!user ? <Login {...routeProps} /> : <Desktop {...routeProps} />)}
        />
      </Switch>
    </div>
  );
};

export default App;
