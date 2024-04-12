import { useEffect, useState } from "react";
import styles from "./Products.module.css";
import { useFetchDocuments } from "../../services/Documents/useFetchDocuments";

const Products = () => {
  const [branchName, setBranchName] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [value, setValue] = useState("");
  const [imgProduct, setImgProduct] = useState("");

  const { documents: branchs } = useFetchDocuments("branchs");
  console.log(branchs)

//   const listBranchs = branchs.map((branch) => (
//     <option key={branch.toString()} value={branch.branchName}>
//       {branch.branchName}
//     </option>
    
//   ));
//  console.log(listBranchs)

  return (
    <div className={styles.products}>
      <div className={styles.form}>
        <form>
          <input
            type="file"
            onChange={(e) => setImgProduct(e.target.files[0])}
          />
          <select name="branch" required="required">
            <option value="">Escolha um setor</option>
          {/* {listBranchs} */}
          </select>

          <input type="text" onChange={(e) => setProductName(e.target.value)} />
          <input
            type="text"
            onChange={(e) => setProductDescription(e.target.value)}
          />
          <input type="text" onChange={(e) => setValue(e.target.value)} />
        </form>
      </div>
    </div>
  );
};

export default Products;
