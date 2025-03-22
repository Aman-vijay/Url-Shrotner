import {createBrowserRouter,createRoutesFromElements,Route, RouterProvider} from "react-router-dom"
import AppLayout from "./layouts/AppLayout"
import Auth from "./pages/Auth"
import Dashboard from "./pages/Dashboard"
import Landing from "./pages/Landing"
import Link from "./pages/Link"
import Redirect from "./pages/Redirect"
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout/>}>
      <Route path="" element={<Landing/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/auth" element={<Auth/>}/>
      <Route path="/link/:id" element={<Link/>}/>
      <Route path="/:id" element={<Redirect/>}/>


    </Route>

  )
)
function App() {



  return <RouterProvider router={router}></RouterProvider>
}

export default App
