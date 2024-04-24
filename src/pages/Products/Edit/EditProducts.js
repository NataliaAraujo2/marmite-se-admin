import styles from "./EditProducts.module.css";
import { useEffect, useState } from "react";
import { storage } from "../../../firebase/config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import ButtonLink from "../../../components/Link/ButtonLink";
import { FaArrowRight } from "react-icons/fa";

import { useUpdateDocument } from "../../../services/Documents/useUpdateDocument";
import { useFetchDocument } from "../../../services/Documents/useFetchDocument";
import { useParams } from "react-router-dom";

const EditProducts = () => {
  const { updateDocument } = useUpdateDocument("products");
  const [imgPreview, setImgPreview] = useState("");
  const [url, setUrl] = useState("");
  const [branchName, setBranchName] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const options = ["ATIVO", "INATIVO"];
  const [price, setPrice] = useState("");
  const [formError, setFormError] = useState("");
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const { id } = useParams();
  const { document: branch } = useFetchDocument("branchs", id);
  return <div></div>;
};

export default EditProducts;
