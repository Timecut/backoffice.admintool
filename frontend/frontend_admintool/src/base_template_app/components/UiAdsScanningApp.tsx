import { useState } from 'preact/hooks'
// import reactLogo from './assets/react.svg?raw'
// import viteLogo from '/vite.svg'
// import './UiAdsScanningApp.css?raw'
import TestComponent from './TestComponent'

export function UiAdsScanningApp() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        {/* <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a> */}
      </div>
      <h1>UiAdsScanningApp</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <TestComponent />
      <p className="read-the-docs">
        Click on...
      </p>
    </>
  )
}
