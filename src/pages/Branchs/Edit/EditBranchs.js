import styles from "./EditBranchs.module.css";
import { useEffect, useState } from "react";
import { storage } from "../../../firebase/config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import ButtonLink from "../../../components/Link/ButtonLink";
import { FaArrowRight } from "react-icons/fa";

import { useUpdateDocument } from "../../../services/Documents/useUpdateDocument";
import { useFetchDocument } from "../../../services/Documents/useFetchDocument";
import { useParams } from "react-router-dom";

const EditBranchs = () => {
  const { updateDocument } = useUpdateDocument("branchs");

  const [imgPreview, setImgPreview] = useState("");
  const [url, setUrl] = useState("");
  const [branchName, setBranchName] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const options = ["ATIVO" , "INATIVO"]
  const [feature1, setFeature1] = useState("");
  const [feature2, setFeature2] = useState("");
  const [feature3, setFeature3] = useState("");
  const [feature4, setFeature4] = useState("");
  const [feature5, setFeature5] = useState("");

  const [formError, setFormError] = useState("");
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const { id } = useParams();
  const { document: branch } = useFetchDocument("branchs", id);

  useEffect(() => {
    try {
      if (branch) {
        // const imgPreview
        setBranchName(branch.name);
        setUrl(branch.url);
        setDescription(branch.description);
        setState(branch.state);
        setFeature1(branch.features[0]);
        setFeature2(branch.features[1]);
        setFeature3(branch.features[2]);
        setFeature4(branch.features[3]);
        setFeature5(branch.features[4]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [branch]);

  const features = [feature1, feature2, feature3, feature4, feature5];

  const onOptionChangeHandler = (event) => {
    setState(event.target.value);
  
};

  const handleClick = async (e) => {
    e.preventDefault();

    setUploadLoading(true);

    if (!imgPreview) {
      const data = {
        name: branchName,
        features,
        description,
        state
      };

      updateDocument(id, data);
      setUploadLoading(false);
      setSuccess(true);
    }

    if (imgPreview) {
      const storageRef = ref(storage, `images/branchs/${branchName}`);

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
                name:branchName,
                features,
                description,
                url,
                state
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
    <div className={styles.branchs}>
      <h1>{branchName}</h1>

      <div className={styles.addBranch}>
        <div className={styles.branchDetails}>
       
         <div className={styles.branchState}>
              <h3>Qual a situação do setor?</h3>
              <select name="state" id="state" onChange={onOptionChangeHandler}>
                <option disabled selected>
                  {state}
                </option>

                {options.map((option, index) => {
                    return (
                        <option key={index}>
                            {option}
                        </option>
                    );
                })}
              
              </select>
            </div>
          <input
            type="file"
            onChange={(e) => setImgPreview(e.target.files[0])}
            placeholder={url}
          />
          <span>Defina até 5 características</span>
          <input type="text" onChange={(e) => setFeature1(e.target.value)} />
          <input type="text" onChange={(e) => setFeature2(e.target.value)} />
          <input type="text" onChange={(e) => setFeature3(e.target.value)} />
          <input type="text" onChange={(e) => setFeature4(e.target.value)} />
          <input type="text" onChange={(e) => setFeature5(e.target.value)} />
          <textarea
            placeholder={description}
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
        <div className={styles.addBranchImagePreview}>
          {!imgPreview && <img src={url} alt="Imagem" />}
          {imgPreview && (
            <img src={URL.createObjectURL(imgPreview)} alt="Foto escolhida" />
          )}
          <div className={styles.branchDetailsPreview}>
            <div className={styles.tittle}>
              <p>{branchName}</p>
            </div>

            <div className={styles.features}>
              <ul>
                <li>{feature1}</li>
                <li>{feature2}</li>
                <li>{feature3}</li>
                <li>{feature4}</li>
                <li>{feature5}</li>
              </ul>
            </div>
            <div className={styles.button}>
              <ButtonLink to="/" text="CONFIRA" Icon={FaArrowRight} disabled />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBranchs;
