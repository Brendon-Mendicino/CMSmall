import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import NavbarComponent from "./components/NavbarComponent";
import LoginComponent from "./components/LoginComponent";
import PageComponent from "./components/PageComponent";
import AuthProvider from "./contexts/AuthContext";
import PageContentsComponent from "./components/PageContentsComponent";
import AddPageComponent from "./components/AddPageComponent";
import Page404 from "./components/Page404";

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
            <Route path="/*" element={<Page404 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
