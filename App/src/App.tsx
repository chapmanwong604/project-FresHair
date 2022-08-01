import React from 'react';
import './App.css';
import AppRoutes from './routes';
import { BrowserRouter } from 'react-router-dom';
import TabBar from './components/TabBar';
import { ClickToComponent } from 'click-to-react-component';
import { MantineProvider } from '@mantine/core';


function App() {
  return (

    <div className="App">
      <MantineProvider
        theme={{
          colors: {
            'retro-blue': ['#2e96bf', '#2e96bf', '#2e96bf', '#2e96bf', '#2e96bf', '#2e96bf', '#2e96bf', '#2e96bf', '#2e96bf', '#2e96bf'],
            'retro-red': ['#66d9c7', '#66d9c7', '#66d9c7', '#66d9c7', '#66d9c7', '#66d9c7', '#66d9c7', '#66d9c7', '#66d9c7', '#66d9c7'],
            'red': ['#c46868', '#c46868', '#c46868', '#c46868', '#c46868', '#c46868', '#c46868', '#c46868', '#c46868', '#c46868'],
          },
        }}
      >
        <ClickToComponent />
        <BrowserRouter>
          <AppRoutes />
          <TabBar />
        </BrowserRouter>
      </MantineProvider>
    </div>
  );
}

export default App;
