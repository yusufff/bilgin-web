import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { toast } from 'react-toastify';
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

toast.configure({
  autoClose: 3000,
  position: toast.POSITION.BOTTOM_LEFT,
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

function PrivateRoute({ component: Component, ...rest }) {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={props =>
        user ? (
          <Component {...props} />
        ) : (
          <Redirect to="/giris" />
        )
      }
    />
  );
}

function PublicRoute({ component: Component, ...rest }) {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={props =>
        !user ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
}

const Wrapper = styled(Grommet)`
  height: 100%;
  overflow: hidden;
`;

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
      const { data } = await axios.get(`https://yarismaapi.akbolat.net/auth/${authUser.username}`);
      if ( data.status ) {
        setUser(data.data);
      }
    } catch({ response }) {
      console.log(response);
    }
  }, [authUser])

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
            {!authUser ? (
              <>
                <PublicRoute exact path="/" component={WIP} />
                <PublicRoute exact path="/giris" component={Login} />
                <PublicRoute exact path="/kayit" component={Register} />
              </>
            ) : (
              <>
                <PrivateRoute exact path="/" component={Home} />
                <PrivateRoute exact path="/profil" component={Profile} />
                <PrivateRoute exact path="/istatistik" component={Stats} />
                <PrivateRoute exact path="/yarisma/:id" component={Game} />
              </>
            )}
          </Wrapper>
        </Div100vh>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
