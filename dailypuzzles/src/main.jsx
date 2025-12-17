import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';

import { HashRouter } from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import './App.css'
const clientId = '578282789818-j60to74ls3ij3u0hkkv4j8vedb7skvbq.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(

    <React.StrictMode>
        <HashRouter>
            <GoogleOAuthProvider clientId={clientId}>

            <App />
                </GoogleOAuthProvider>

        </HashRouter>
    </React.StrictMode>,
)
