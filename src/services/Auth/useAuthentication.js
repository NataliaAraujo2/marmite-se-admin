import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
  } from "firebase/auth";
  import { useInsertDocument } from "../Documents/useInsertDocument";
  import { useState, useEffect } from "react";
  
  export const useAuthentication = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(null);
    const [cancelled, setCancelled] = useState(false);
    const authUser = "user";
    const { insertDocument } = useInsertDocument("users");
  
    const auth = getAuth();
  
    function checkIfIsCancelled() {
      if (cancelled) {
        setError("Algo deu errado, tente novamente mais tarde!");
        return;
      }
    }
  
    const createUser = async (data) => {
      checkIfIsCancelled();
      setLoading(true);
      setError(null);
  
      try {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
  
        await updateProfile(user, { displayName: data.displayName });
  
        insertDocument({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          authUser,
        });
  
        setLoading(false);
        return user;
      } catch (error) {
        console.log(error.message);
        console.log(typeof error.message);
        if (error.message.includes("email-already")) {
          setError("Email já cadastrado!");
        } else if (error.message.includes("weak-password")) {
          setError("A senha precisa ter no mínimo 6 caracteres");
        } else {
          setError("Ocorreu um erro. Tente novamente mais tarde.");
        }
      }
      setLoading(false);
    };
  
    //sign out
    const logout = () => {
      checkIfIsCancelled();
      signOut(auth);
    };
  
    //sign in
    const login = async (data) => {
      checkIfIsCancelled();
      setLoading(true);
      setError(false);
      try {
        await signInWithEmailAndPassword(auth, data.email, data.password);
  
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        console.log(typeof error.message);
        if (error.message.includes("invalid-credential")) {
          setError("Usuário não encontrado ou Senha Inválida!");
        } else {
          setError("Ocorreu um erro. Tente novamente mais tarde.");
        }
        setLoading(false);
      }
    };
  
    useEffect(() => {
      return () => setCancelled(true);
    }, []);
  
    return {
      auth,
      createUser,
      error,
      loading,
      logout,
      login,
    };
  };