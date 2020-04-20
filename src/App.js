import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { toast, cssTransition } from 'react-toastify';
import { Grommet } from 'grommet';
import styled from 'styled-components';
import Div100vh from 'react-div-100vh';
import axios from 'axios';

import BottomTabs from './components/BottomTabs';

import WIP from './pages/Auth/WIP';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Stats from './pages/Stats';
import Game from './pages/Game';

import { AuthContext, useAuth } from "./hooks/use-auth";

import 'react-toastify/dist/ReactToastify.css';

import BufferSound from './assets/buffer.mp3';

const Slide = cssTransition({
  enter: 'slideUp',
  exit: 'slideDown',
  duration: 450,
});
toast.configure({
  autoClose: 3000,
  position: toast.POSITION.BOTTOM_LEFT,
  transition: Slide,
});

const theme = {
  global: {
    colors: {
      'neutral-5': '#17152D',
    },
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
    elevation: {
      light: {
        r_xsmall: "0px -1px 2px rgba(0, 0, 0, 0.20)",
        r_small: "0px -2px 4px rgba(0, 0, 0, 0.20)",
        r_medium: "0px -4px 8px rgba(0, 0, 0, 0.20)",
        r_large: "0px -8px 16px rgba(0, 0, 0, 0.20)",
        r_xlarge: "0px -12px 24px rgba(0, 0, 0, 0.20)",
      },
      dark: {
        r_xsmall: "0px -2px 2px rgba(255, 255, 255, 0.40)",
        r_small: "0px -4px 4px rgba(255, 255, 255, 0.40)",
        r_medium: "0px -6px 8px rgba(255, 255, 255, 0.40)",
        r_large: "0px -8px 16px rgba(255, 255, 255, 0.40)",
        r_xlarge: "0px -12px 24px rgba(255, 255, 255, 0.40)",
      },
    },
  },
  button: {
    border: {
      radius: '8px',
    },
    size: {
      small: {
        border: {
          radius: '8px',
        },
      },
      medium: {
        border: {
          radius: '8px',
        },
      },
      large: {
        border: {
          radius: '8px',
        },
      },
    },
  },
};

function PrivateRoute({ children, ...rest }) {
  const { user } = useAuth();

  return (
    <Route {...rest}>
      {user ? (
        children
      ) : (
        <Redirect to="/giris" />
      )}
    </Route>
  );
}

function PublicRoute({ children, ...rest }) {
  const { user } = useAuth();

  return (
    <Route {...rest}>
      {!user ? (
        children
      ) : (
        <Redirect to="/" />
      )}
    </Route>
  );
}

const Wrapper = styled(Grommet)`
  height: 100%;
  overflow: hidden;
`;

window.bufferAudio = new Audio(BufferSound);

function App() {
  const existingUser = JSON.parse(localStorage.getItem('user'));
  const [authUser, setAuthUser] = useState(existingUser);
  const [showTabs, setShowTabs] = useState(true);

  const setUser = (data) => {
    if ( data ) {
      localStorage.setItem('user', JSON.stringify(data));
    } else {
      localStorage.removeItem('user');
    }
    setAuthUser(data);
  }

  const fetchProfile = useCallback(async () => {
    if ( !authUser ) return false;

    try {
      const { data } = await axios.get(`https://lolitoys.net/auth/${authUser.username}`);
      if ( data.status ) {
        setUser(data.data);
        if ( window.FS ) {
          window.FS.identify(data.data.id, {
            displayName: data.data.username,
            email: data.data.email,
            phone: data.data.phone,
          });
          window.FS.setUserVars({
            uid: data.data.id,
            displayName: data.data.username,
            email: data.data.email,
            phone: data.data.phone,
           });
        }
      }
    } catch({ response }) {
      console.log(response);
    }
  }, [authUser])

  useEffect(() => {
    fetchProfile();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{
      user: authUser,
      setUser,
      fetchProfile,
      setShowTabs,
    }}>
      <Router>
        <Div100vh>
          <Wrapper cssVars theme={theme} background="var(--brand)">
            {authUser && showTabs && <BottomTabs />}
            <Switch>
              {!authUser ? (
                <>
                  <PublicRoute exact path="/"><WIP /></PublicRoute>
                  <PublicRoute path="/giris"><Login /></PublicRoute>
                  <PublicRoute path="/kayit"><Register /></PublicRoute>
                </>
              ) : (
                <>
                  <PrivateRoute exact path="/"><Home /></PrivateRoute>
                  <PrivateRoute path="/yarisma/:id"><Game /></PrivateRoute>
                  <PrivateRoute path="/profil"><Profile /></PrivateRoute>
                  <PrivateRoute path="/istatistik"><Stats /></PrivateRoute>
                </>
              )}
            </Switch>
          </Wrapper>
        </Div100vh>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
