import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { NavBar } from "./Components/NavBar";
import "./Assests/css/main.css";
import { NotFoundPage } from "./Pages/NotFoundPage";
import { publicRoutes } from "./Components/publicRoutes";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <>
              <NavBar />
              <Outlet />
            </>
          }
        >
          {publicRoutes.map((route) => (
            <Route path={route.path} element={<route.el />}></Route>
          ))}
        </Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
