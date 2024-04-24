import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import styles from "./Products.module.css";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, storage } from "../../../firebase/config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useInsertDocument } from "../../../services/Documents/useInsertDocument";
import { useFetchDocuments } from "../../../services/Documents/useFetchDocuments";
import logo from "../../../images/logo-removebg.png";
import ButtonLink from "../../../components/Link/ButtonLink";
import ProductCard from "../../../components/ProductCard/ProductCard";

const Products = () => {
  //const products
  const [docId, setDocId] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const options = ["ATIVO", "INATIVO"];
  const [description, setDescription] = useState("");
  const [branchName, setBranchName] = useState("");
  const [url, setUrl] = useState("");
  const [price, setPrice] = useState("0,00");

  //const render
  const [noSave, setNoSave] = useState(null);
  const [existBranch, setExistBranch] = useState([]);
  const [existProducts, setExistProducts] = useState([]);
  const [success, setSuccess] = useState(false);
  const [imgPreview, setImgPreview] = useState("");
  const [uploadLoading, setUploadLoading] = useState(null);
  const [progress, setProgress] = useState(0);
  const [formError, setFormError] = useState("");
  const [renderedPrice, setRenderedPrice] = useState("");
  const existProduct = [];

  //const services
  const { insertDocument } = useInsertDocument("products");
  const { documents: branchs } = useFetchDocuments("branchs");
  const { documents: products } = useFetchDocuments("products");

  useEffect(() => {
    function compare(a, b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    }

    if (branchs) {
      const sortBranchsName = branchs.sort(compare);
      setExistBranch(sortBranchsName);
    }

    if (products) {
      const sortProductsName = products.sort(compare);
      setExistProducts(sortProductsName);
    }
  }, [branchs, products]);

  const onOptionChangeBranchHandler = (event) => {
    setBranchName(event.target.value);
  };

  const handleProducts = async (e) => {
    e.preventDefault();
    setNoSave(null);
    setSuccess(false);
    setFormError("");

    if (!branchName) {
      setFormError("O setor é obrigatório!");
      setUploadLoading(false);
      return;
    }

    const q = query(collection(db, "products"), where("name", "==", name));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setDocId(doc.id);
        existProduct.push([doc.data().name]);
      });
      if (existProduct.length > 0) {
        setNoSave(true);
      } else {
        setNoSave(false);
      }

      console.log(unsubscribe);
      console.log(docId);
    });
  };

  const onOptionChangeHandler = (event) => {
    setState(event.target.value);
  };

  const handlePrice = (e) => {
    e.preventDefault();
    const onlyDigits = e.target.value
      .split("")
      .filter((s) => /\d/.test(s))
      .join("")
      .padStart(0, "0");

    const digitsFloat = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2);
    setPrice(digitsFloat);

    const renderPrice = onlyDigits.slice(0, -2) + "," + onlyDigits.slice(-2);
    setRenderedPrice(renderPrice);
    e.target.value = renderPrice;
  };

  const handleClick = async (e) => {
    e.preventDefault();
    console.log(noSave);

    if (noSave === true) {
      return;
    }
    setUploadLoading(true);

    if (!imgPreview) {
      setFormError("Selecione uma imagem");
      setUploadLoading(false);
      return;
    }

    const storageRef = ref(storage, `images/${branchName}/${name}`);

    const uploadTask = uploadBytesResumable(storageRef, imgPreview);

    console.log(uploadTask);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setUrl(url);
          if (url) {
            insertDocument({
              branchName,
              name,
              description,
              price,
              url,
              state,
            });

            setUrl("");
            setProgress(0);
            setSuccess(true);
            setUploadLoading(false);
            setBranchName("");
            setFormError("");
          } else {
            setFormError("Ocorreu um erro! Tente novamente mais tarde");
          }
        });
      }
    );
    setUrl("");
    setProgress(0);
    setSuccess(true);
    setUploadLoading(false);
    setBranchName("");
    setFormError("");
  };
  console.log(name);
  return (
    <div className={styles.products}>
      <h2>CADASTRAR NOVO PRODUTO</h2>
      <div className={styles.searchs}>
        <div className={styles.search}>
          <h3>Escolha o setor do seu produto</h3>
          <select onChange={onOptionChangeBranchHandler} id="itens">
            <option>Escolha uma opção</option>
            {existBranch &&
              existBranch.map((branch) => (
                <option value={branch.name} key={branch.id}>
                  {branch.name}
                </option>
              ))}
          </select>
          {formError && <p className="error">{formError}</p>}
        </div>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Qual o nome do produto?"
            value={name}
            autoCapitalize="characters"
            onChange={(e) => setName(e.target.value.toUpperCase())}
          />
          <button onClick={handleProducts}>OK</button>
        </div>
      </div>
      <div className={styles.productListDiv}>
        {noSave === null &&
          existProducts &&
          existProducts.map((product) => (
            <div className={styles.productList} key={product.id}>
              <img src={product.url} alt={product.name} />
              <span>{product.name}</span>
              <ButtonLink
                to={`/editProducts/${product.id}`}
                text="EDITAR"
                Icon={FaEdit}
              />
            </div>
          ))}
      </div>
      {noSave === false && (
        <div className={styles.addProduct}>
          <div className={styles.productDetails}>
            <div className={styles.productState}>
              <h3>Qual a situação do produto?</h3>
              <select name="state" id="state" onChange={onOptionChangeHandler}>
                <option>Escolha uma opção</option>

                {options.map((option, index) => {
                  return <option key={index}>{option}</option>;
                })}
              </select>
            </div>
            <input
              type="file"
              onChange={(e) => setImgPreview(e.target.files[0])}
            />
            <input
              type="text"
              placeholder="Qual o preço do Produto"
              onInput={handlePrice}
            />

            <textarea
              placeholder="Coloque a descrição"
              onChange={(e) => setDescription(e.target.value)}
            />
            <div>
              {url === logo && <progress value={progress} max="100" />}
              {!uploadLoading ? (
                <button onClick={handleClick}>Enviar</button>
              ) : (
                <button disabled>Aguarde...</button>
              )}
              {formError && <p className="error">{formError}</p>}
              {success && <p className="success">Dados salvos com sucesso</p>}
            </div>
          </div>
          <ProductCard
            src={!imgPreview ? logo : URL.createObjectURL(imgPreview)}
            name={name}
            price={renderedPrice}
            description={description}
          />
        </div>
      )}

      {noSave === true && (
        <div className={styles.edit}>
          <p>Setor já cadastrado.</p>
          <ButtonLink
            to={`/editProducts/${docId}`}
            text="Clique Aqui para editá-lo"
            Icon={FaEdit}
          ></ButtonLink>
        </div>
      )}
    </div>
  );
};

export default Products;
