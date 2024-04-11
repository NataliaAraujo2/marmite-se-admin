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
import HomeAdmin from "./pages/Home/HomeAdmin";
import Teste from "./pages/teste/Teste";

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
              <Sidebar key={user} />
            </div>
            <div className="main_container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/teste" element={<Teste />} />
                <Route
                  path="/login"
                  element={!user ? <Login /> : <Navigate to="/homeAdmin" />}
                />
                <Route
                  path="/branchs"
                  element={user ? <Branchs /> : <Navigate to="/" />}
                />
                 <Route
                  path="/homeAdmin"
                  element={user ? <HomeAdmin /> : <Navigate to="/" />}
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
