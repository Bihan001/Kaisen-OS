import { useContext, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from './Contexts/AuthContext';

import Login from './pages/Login/Login';
import Desktop from './pages/Desktop/Desktop';
import { backendUrl } from './backendUrl';

import './App.css';

const App = () => {
  const { user, setUser } = useContext(AuthContext);
  useEffect(() => {
    axios
      .get(`${backendUrl}/api/auth/profile`)
      .then((res) => setUser(res.data.data.user))
      .catch((err) => setUser(null));
  }, []);
  return (
    <div className="App no-select">
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
