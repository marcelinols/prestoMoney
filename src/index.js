import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';

import App from './App'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './asset/style/App.css';

//hook  
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './hook/reducer';
import { BrowserRouter } from 'react-router-dom';

let store = createStore(reducers)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </BrowserRouter>
); 
