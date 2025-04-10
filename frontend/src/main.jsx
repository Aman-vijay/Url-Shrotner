import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProider } from "./Context/AuthContext"

createRoot(document.getElementById('root')).render(
  <AuthProider>
  <App />
  </AuthProider>,
 
)
