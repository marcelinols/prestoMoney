import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './asset/style/App.css';

//hook  
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './hook/reducer';

let store = createStore(reducers)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>
); 
