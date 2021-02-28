import { useContext, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from './Contexts/AuthContext';

import Login from './pages/Login/Login';
import Desktop from './pages/Desktop/Desktop';

import './App.css';

const App = () => {
  const { user, setUser } = useContext(AuthContext);
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/auth/profile')
      .then((res) => setUser(res.data.data))
      .catch((err) => setUser(null));
  }, []);
  return (
    <div className='App no-select'>
      <Switch>
        {/* <Route exact path='/login' render={(routeProps) => <Login {...routeProps} />} /> */}
        <Route
          exact
          path='/'
          render={(routeProps) => (!user ? <Login {...routeProps} /> : <Desktop {...routeProps} />)}
        />
      </Switch>
    </div>
  );
};

export default App;
