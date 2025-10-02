import Router from "./routes/Index"
import { StoreProvider } from "./context/StoreProvider"
import { ToastMessageProvider } from "./context/ToastMessageProvider"

function App() {

  return (
    <StoreProvider>
      <ToastMessageProvider>
        <Router />
      </ToastMessageProvider>
    </StoreProvider>
  )
}

export default App
