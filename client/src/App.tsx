import Router from "./routes/Index"
import { StoreProvider } from "./StoreProvider"

function App() {

  return (
    <StoreProvider>
      <Router />
    </StoreProvider>
  )
}

export default App
