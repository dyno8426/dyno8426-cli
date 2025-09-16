// Application entry: mounts the TerminalPortfolio single-page app.
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import TerminalPortfolio from './TerminalPortfolio'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TerminalPortfolio />
  </React.StrictMode>,
)
