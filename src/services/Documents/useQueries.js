import { useState, useEffect, useReducer } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const initialState = {
  loading: null,
  error: null,
};

const insertReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "FILTERED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const useQueries = (docCollection) => {
  const [response, dispatch] = useReducer(insertReducer, initialState);
  const [document, setDocument] = useState("");
  const [idDocument, setIdDocument] = useState("")

  //deal with memory leak
  const [cancelled, setCancelled] = useState(false);

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };

  const filter = async (field, demand) => {
    checkCancelBeforeDispatch({ type: "LOADING" });

    try {
      const q = query(
        collection(db, docCollection),
        where(field, "==", demand)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setIdDocument(doc.id)
        setDocument(doc.data());
      });
      
    //   console.log(document);

      checkCancelBeforeDispatch({
        type: "FILTERED_DOC",
        payload: querySnapshot,
      });
    } catch (error) {
      checkCancelBeforeDispatch({
        type: "ERROR",
        payload: error.message,
      });
      return;
    }
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { filter, document, idDocument, response };
};