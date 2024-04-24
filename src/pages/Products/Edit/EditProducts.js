import styles from "./EditProducts.module.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchDocument } from "../../../services/Documents/useFetchDocument";
import { useFetchDocuments } from "../../../services/Documents/useFetchDocuments";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../firebase/config";
import { useUpdateDocument } from "../../../services/Documents/useUpdateDocument";
import ProductCard from "../../../components/ProductCard/ProductCard";

const EditProducts = () => {
  const { id } = useParams();
  const { document: product } = useFetchDocument("products", id);
  const { documents: branchs } = useFetchDocuments("branchs");
  const { updateDocument } = useUpdateDocument("products");
  const [existBranch, setExistBranch] = useState([]);

  const [branchName, setBranchName] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [renderedPrice, setRenderedPrice] = useState("");
  const [state, setState] = useState("");
  const [url, setUrl] = useState("");
  const options = ["ATIVO", "INATIVO"];
  const [imgPreview, setImgPreview] = useState("");

  const [uploadLoading, setUploadLoading] = useState(null);
  const [progress, setProgress] = useState(0);

  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    function compare(a, b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    }

    if (product) {
      setBranchName(product.branchName);
      setName(product.name);
      setDescription(product.description);
      const onlyDigits = product.price
        .split("")
        .filter((s) => /\d/.test(s))
        .join("")
        .padStart(0, "0");
      setPrice(onlyDigits.slice(0, -2) + "," + onlyDigits.slice(-2));
      setUrl(product.url);
    }

    if (branchs) {
      const sortBranchsName = branchs.sort(compare);
      setExistBranch(sortBranchsName);
    }

    // return () => {
    //   second;
    // };
  }, [product, branchs]);

  const onOptionChangeBranchHandler = (event) => {
    setBranchName(event.target.value);
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

    setUploadLoading(true);

    if (!imgPreview) {
      const data = {
        name,
        price,
        description,
        state,
      };

      updateDocument(id, data);
      setUploadLoading(false);
      setSuccess(true);
    }

    if (imgPreview) {
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
              const data = {
                name,
                description,
                price,
                url,
                state,
              };

              updateDocument(id, data);

              setUrl("");
              setProgress(0);
              setSuccess(true);
              setUploadLoading(false);
              setBranchName("");
            } else {
              setFormError("Ocorreu um erro! Tente novamente mais tarde");
            }
          });
        }
      );
    }
  };

  return (
    <div className={styles.editProducts}>
      <h1>{name}</h1>
      <div className={styles.addProduct}>
        <div className={styles.productDetails}>
          <div className={styles.search}>
            <h3>Escolha o setor do seu produto</h3>
            <select onChange={onOptionChangeBranchHandler} id="itens">
              <option defaultValue>{branchName}</option>
              {existBranch &&
                existBranch.map((branch) => (
                  <option value={branch.name} key={branch.id}>
                    {branch.name}
                  </option>
                ))}
            </select>
            {formError && <p className="error">{formError}</p>}
          </div>
          <div className={styles.productState}>
            <h3>Qual a situação do produto?</h3>
            <select name="state" id="state" onChange={onOptionChangeHandler}>
              <option disabled defaultValue>
                {state}
              </option>

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
            {url && <progress value={progress} max="100" />}
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
          src={!imgPreview ? url : URL.createObjectURL(imgPreview)}
          name={name}
          price={!renderedPrice ? price : renderedPrice}
          description={description}
        />
      </div>
    </div>
  );
};

export default EditProducts;
