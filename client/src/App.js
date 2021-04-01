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
    fetch(
      'https://firebasestorage.googleapis.com/v0/b/mern-authentication-6634c.appspot.com/o/test.txt?alt=media&token=d65533ec-227a-4e2b-8e4f-25dfb36801d1'
    )
      .then((res) => res.text())
      .then((text) => console.log(text));
    axios
      .get('http://localhost:5000/api/auth/profile')
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
