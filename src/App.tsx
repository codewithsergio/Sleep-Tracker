import "./App.css";
import {
  RouterProvider,
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import { ContextProvider } from "./context/Context";
import LoginSetup from "./components/LoginSetup";
import Exercises from "./components/Exercises";
import BottomNavBar from "./components/BottomNavBar";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<LoginSetup />} />
        <Route
          path="exercises"
          element={
            <>
              <Exercises />
              <BottomNavBar />
            </>
          }
        />
        {/* <Route
          path="tasks"
          element={
            <>
              <Tasks />
              <BottomNavBar />
            </>
          }
        /> */}
      </Route>
    )
  );
  return (
    <>
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </>
  );
}

export default App;
