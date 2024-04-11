import styles from "./Branchs.module.css";
import { useFetchDocuments } from "../../services/Documents/useFetchDocuments";
import BranchDetail from "../../components/Branch/BranchDetail";
import { useState } from "react";
import { storage } from "../../firebase/config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useInsertDocument } from "../../services/Documents/useInsertDocument";
import { useQueries } from "../../services/Documents/useQueries";
import logo from "../../images/logo-removebg.png";
import ButtonLink from "../../components/Link/ButtonLink";
import { FaArrowRight } from "react-icons/fa";

const Branchs = () => {
  const { insertDocument } = useInsertDocument("branchs");
  const { filter: filterBranchs, document: filteredBranch } =
    useQueries("branchs");

  const [img, setImg] = useState("");
  const [imgPreview, setimgPreview] = useState("");
  const [url, setUrl] = useState("");
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

  const { documents: branchs } = useFetchDocuments("branchs");

  const features = [feature1, feature2, feature3, feature4, feature5];
  const listFeatures = features.map((feature) => (
    <li key={feature.toString()}>{feature}</li>
  ));
  console.log(features);

  async function queryBranchName() {
    const field = "branchName";
    const demand = branchName;
    await filterBranchs(field, demand);
  }
  const handleClick = (e) => {
    e.preventDefault();

    queryBranchName();

    console.log(filteredBranch);

    if (filteredBranch.branchName === branchName) {
      setFormError("Setor já Cadastrado");
      return;
    }

    if (!imgPreview) {
      setFormError("Selecione uma imagem");
      return;
    }

    setImg(imgPreview);

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
            queryBranchName();
          } else {
            setFormError("Ocorreu um erro! Tente novamente mais tarde");
          }
        });
      }
    );
  };

  return (
    <div className={styles.branchs}>
      <div className={styles.addBranch}>
        <div className={styles.branchDetails}>
          <input
            type="text"
            placeholder="Qual o nome do setor?"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setimgPreview(e.target.files[0])}
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
            {!uploadLoading ? (
              <button onClick={handleClick}>Enviar</button>
            ) : (
              <button disabled>Aguarde...</button>
            )}
            {formError && <p className="error">{formError}</p>}
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
              <ButtonLink to="/" text="CONFIRA" Icon={FaArrowRight} disabled />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.branchsList}>
        {branchs && branchs.length === 0 && <p>Não há setores cadastrados!</p>}

        {branchs &&
          branchs.map((branch) => (
            <div key={branch.id}>
              <span>{branch.branchName}</span>
              <button>Editar</button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Branchs;
