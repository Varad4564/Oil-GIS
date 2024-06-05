import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { ToolKitStore } from './ReduxRelated/Store/toolkitStore.js'



import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={ToolKitStore}>
    <App />
  </Provider>
  // </React.StrictMode>,
)
