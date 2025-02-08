import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// PWAの登録
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  // vite-plugin-pwaが生成したService Workerを登録
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({
      onRegistered(r: ServiceWorkerRegistration | undefined) {
        console.log('Service Worker registered:', r)
      },
      onRegisterError(e: Error) {
        console.error('Service Worker registration failed:', e)
      }
    })
  })
}
