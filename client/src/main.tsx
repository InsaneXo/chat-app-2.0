
import { createRoot } from 'react-dom/client'
import './index.css'
import '../axios.config.ts'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <App />,
)
