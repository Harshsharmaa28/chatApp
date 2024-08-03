import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
  // Simulating user authentication status
  //   console.log(rest)
  //   console.log(Component)
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Check if userInfo and accessToken exist
  const isAuthenticated = userInfo && userInfo.accessToken;
  // console.log(userInfo); // This will show the entire userInfo object

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/" />;
};

export default PrivateRoute;
