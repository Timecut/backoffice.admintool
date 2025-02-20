import { useState } from 'preact/hooks'
import { PageCalendar } from './PageCalendar'
// import reactLogo from './assets/react.svg?raw'
// import viteLogo from '/vite.svg'
// import './UiAdsScanningApp.css?raw'
// import TestComponent from './TestComponent'

export function UiAdsScanningApp() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>AdsScanningApp</h1>
      <PageCalendar />

      {/* <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div> */}

      {/* <TestComponent /> */}


      {/* <p className="read-the-docs">
        Click on...
      </p> */}
    </>
  )
}
