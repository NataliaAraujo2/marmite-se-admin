import { useState } from "react";
import styles from "./Branchs.module.css";
import { useFetchDocuments } from "../../services/Documents/useFetchDocuments";
import noImageUpload from "../../images/logo.png";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase/config";
import { useInsertDocument } from "../../services/Documents/useInsertDocument";
import BranchDetail from "../../components/Branch/BranchDetail";
import { useQueries } from "../../services/Documents/useQueries";

const Branchs = () => {
  const [branchName, setBranchName] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imgURL, setImgURL] = useState(noImageUpload);
  const [progress, setProgress] = useState(0);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const { documents: branchs } = useFetchDocuments("branchs");
  //const insert a new document
  const { insertDocument } = useInsertDocument("branchs");
  //filtrando setores
  const {filter: filterBranchs, document: filteredBranch} = useQueries("branchs")



  const handleSubmit = (e) => {
    e.preventDefault();
    setUploadLoading(true);
    setFormError("");
    setSuccess(false);
    
      const field = "branchName";
      const demand = document.getElementById("banchName").value
      filterBranchs(field, demand)
   
  
    if(filteredBranch) {
      setFormError("Setor já cadastrado")
      return;
    }

   const file = document.getElementById("file").value

    console.log(imagePreview)

    if (!file) {
      setFormError("Selecione uma imagem");
      setUploadLoading(false)
      return;
    }

    const storageRef = ref(storage, `images/branchs/${branchName}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

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
          setImgURL(url);
          if (url) {
            insertDocument({
              branchName,
              image: url,
            });

            setImagePreview("");

            const imageInput = document.getElementById("image");
            imageInput.value = "";
            setImgURL(noImageUpload);
            setProgress(0);
            setSuccess(true);
            setUploadLoading(false);
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
      <div className={styles.addBranch}>
        <form>
          <div className={styles.addBranchDetails}>
            <label htmlFor="">
              <input
                type="text"
                id="banchName"
                placeholder="Nome do Setor"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
              />
            </label>
            <label htmlFor="">
              <input
                type="file"
                id="image"
                name="image"
                onChange={(e) => setImagePreview(e.target.files[0])}
              />
            </label>

        
          </div>
          <div className={styles.addBranchImagePreview}>
            {!imagePreview && <img src={imgURL} alt="Imagem" />}
            {imagePreview && (
              <img
                src={URL.createObjectURL(imagePreview)}
                alt="Foto escolhida"
              />
            )}
            
          </div>
        <div>
        {imgURL === noImageUpload && <progress value={progress} max="100" />}
        {!uploadLoading ? (
              <button>CADASTRAR</button>
            ) : (
              <button disabled>Aguarde...</button>
            )}
          {formError && <p className="error">{formError}</p>}
          {success && <p className="success">Imagem enviada com sucesso!</p>}
        </div>
        </form>
      </div>
      <div className={styles.branchsList}>
        {branchs && branchs.length === 0 && (
          <div>
            <p>Não há setores cadastrados!</p>
          </div>
        )}
        {branchs && branchs.map((branch) => <BranchDetail key={branch.id} branch={branch} /> )}
      </div>
    </div>
  );
};

export default Branchs;
