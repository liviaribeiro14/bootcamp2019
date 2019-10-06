import React from 'react';
import { StatusBar } from 'react-native';

import './config/ReactotronConfig';

import Header from './components/Header';

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#191920" />
      <Header />
    </>
  );
};

export default App;
