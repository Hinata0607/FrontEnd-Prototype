import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { store } from './redux/store';
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <React.StrictMode>
    <Provider store={store}>
      <Routes>
        <Route path="*" element={<App />}/>
      </Routes>
    </Provider>
  </React.StrictMode>  
  </BrowserRouter>
);