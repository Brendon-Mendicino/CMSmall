import { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Router,
  Routes,
} from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import LoginComponent from "./components/LoginComponent";
import PageComponent from "./components/PageComponent";
import AuthProvider from "./contexts/AuthContext";
import PageContentsComponent from "./components/PageContentsComponent";
import AddPageComponent from "./components/AddPageComponent";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <>
                <NavbarComponent />
                <Outlet />
              </>
            }
          >
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/pages" element={<PageComponent />} />
            <Route path="/pages/add" element={<AddPageComponent />} />
            <Route
              path="/pages/:pageId/contents"
              element={<PageContentsComponent />}
            />
            <Route path="/" element={<Navigate to="/pages" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
