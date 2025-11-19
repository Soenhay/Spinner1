import React from 'react'
import SpinnerApp from './components/SpinnerApp'

export default function App() {
  return (
    <div className="container">
      <header>
        <h1>🎯 Spinner Wheel</h1>
        <p className="subtitle">Add your options and spin to make a choice!</p>
      </header>
      <main>
        <div className="content-wrapper">
          <SpinnerApp />
        </div>
      </main>
      <footer>
        <p>Made with ❤️ | Ready for Netlify deployment</p>
      </footer>
    </div>
  )
}
