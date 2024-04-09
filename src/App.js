import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import Sidebar from "./components/Sidebar/Sidebar";
import { AuthProvider } from "./context/AuthContext";
import { useEffect, useState } from "react";
import { useAuthentication } from "./services/Auth/useAuthentication";
import { onAuthStateChanged } from "firebase/auth";

//pages
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Branchs from "./pages/Branchs/Branchs";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const [user, setUser] = useState(undefined);

  const { auth } = useAuthentication();

  const loadingUser = user === undefined;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, [auth]);

  if (loadingUser) {
    return <p>Carregando...</p>;
  }
  return (
    <div className="App">
      <AuthProvider value={{ user }}>
        <BrowserRouter>
          <Navbar />

          <div className="container">
            <div className="sidebar_container">
              <Sidebar />
            </div>
            <div className="main_container">
              <Routes>
                <Route path="/admin" element={<Home />} />
                <Route
                  path="/admin/login"
                  element={!user ? <Login /> : <Navigate to="/" />}
                />
                <Route
                  path="/admin/branchs"
                  element={user ? <Branchs /> : <Navigate to="/" />}
                />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
