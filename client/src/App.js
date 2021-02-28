import './App.css';
import {Switch,Route} from "react-router-dom";

import {ThemeProvider} from "./Contexts/ThemeContext/ThemeContext";
import {DirectoryProvider} from "./Contexts/DirectoryContext/DirectoryContext";


import Login from "./pages/Login/Login";
import Desktop from "./pages/Desktop/Desktop";

function App() {
  return (
    <div className="App no-select">
      

        <ThemeProvider>
          <DirectoryProvider>
            <Switch>
                  <Route exact path="/login" render={(routeProps)=><Login {...routeProps}/>}/>
                  <Route exact path="/" render={(routeProps)=><Desktop {...routeProps}/>}/>
            </Switch>
          </DirectoryProvider>
        </ThemeProvider>
 
       
       
    </div>
  );
}

export default App;
