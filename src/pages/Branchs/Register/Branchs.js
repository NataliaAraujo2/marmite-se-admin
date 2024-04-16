import styles from "./Branchs.module.css";
import { useState } from "react";
import { db, storage } from "../../../firebase/config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useInsertDocument } from "../../../services/Documents/useInsertDocument";
import logo from "../../../images/logo-removebg.png";
import ButtonLink from "../../../components/Link/ButtonLink";
import { FaArrowRight, FaEdit } from "react-icons/fa";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

const Branchs = () => {
  const { insertDocument } = useInsertDocument("branchs");


  const [imgPreview, setImgPreview] = useState("");
  const [url, setUrl] = useState(logo);
  const [docId, setDocId] =useState("")
  const [branchName, setBranchName] = useState("");
  const [description, setDescription] = useState("");
  const [feature1, setFeature1] = useState("1");
  const [feature2, setFeature2] = useState("2");
  const [feature3, setFeature3] = useState("3");
  const [feature4, setFeature4] = useState("4");
  const [feature5, setFeature5] = useState("5");
  const [formError, setFormError] = useState("");
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [noSave, setNoSave] = useState(null);
  const existBranch = [];

  const features = [feature1, feature2, feature3, feature4, feature5];
  const listFeatures = features.map((feature) => (
    <li key={feature.toString()}>{feature}</li>
  ));

  const handleBranchs = async (e) => {
    e.preventDefault();
    setNoSave(false);

    const q = query(
      collection(db, "branchs"),
      where("branchName", "==", branchName)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setDocId(doc.id)
        existBranch.push([doc.data().branchName]);
      });

      if (existBranch.length > 0) {
        setNoSave(true);
      }
      console.log(unsubscribe);
      console.log(docId)
    });
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
      return;
    }


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
            insertDocument({
              branchName,
              features,
              description,
              url,
            });

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
  };

  return (
    <div className={styles.branchs}>
      <h2>CADASTRAR NOVO SETOR</h2>
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Qual o nome do setor?"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
        />
        <button onClick={handleBranchs}>OK</button>
      </div>
      {noSave === false && (
        <div className={styles.addBranch}>
          <div className={styles.branchDetails}>
            <input
              type="file"
              onChange={(e) => setImgPreview(e.target.files[0])}
            />
            <span>Defina até 5 características</span>
            <input
              type="text"
              onChange={(e) => setFeature1(e.target.value)}
              placeholder="Característica 1"
            />
            <input
              type="text"
              onChange={(e) => setFeature2(e.target.value)}
              placeholder="Característica 2"
            />
            <input
              type="text"
              onChange={(e) => setFeature3(e.target.value)}
              placeholder="Característica 3"
            />
            <input
              type="text"
              onChange={(e) => setFeature4(e.target.value)}
              placeholder="Característica 4"
            />
            <input
              type="text"
              onChange={(e) => setFeature5(e.target.value)}
              placeholder="Característica 5"
            />
            <textarea
              placeholder="Coloque a descrição"
              onChange={(e) => setDescription(e.target.value)}
            />
            <div>
              {url === logo && (
                <progress value={progress} max="100" />
              )}
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
            {!imgPreview && <img src={logo} alt="Imagem" />}
            {imgPreview && (
              <img src={URL.createObjectURL(imgPreview)} alt="Foto escolhida" />
            )}
            <div className={styles.branchDetailsPreview}>
              <div className={styles.tittle}>
                <p>{branchName}</p>
              </div>

              <div className={styles.features}>
                <ul>{listFeatures}</ul>
              </div>
              <div className={styles.button}>
                <ButtonLink
                  to="/"
                  text="CONFIRA"
                  Icon={FaArrowRight}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {noSave === true && (
        <div className={styles.edit}>
          <p>Setor já cadastrado.</p>
          <ButtonLink
            to={`/editBranchs/${docId}`}
            text="Clique Aqui para editá-lo"
            Icon={FaEdit}
          ></ButtonLink>
        </div>
      )}
    </div>
  );
};

export default Branchs;
