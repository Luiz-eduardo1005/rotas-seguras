import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LimiteErro from './components/LimiteErro.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LimiteErro>
      <App />
    </LimiteErro>
  </StrictMode>,
)
