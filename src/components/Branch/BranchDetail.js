import styles from "./BranchDetail.module.css";

const BranchDetail = ({ branch }) => {
  const branchImage = branch.image;
  console.log(branchImage);
  return (
    <div className={styles.branchDetail}>
      <h3>{branch.name}</h3>

      <div className={styles.branchImage}>
        <img
          className={styles.image}
          src={branch.url}
          alt="Setor"
        />
      </div>
    </div>
  );
};

export default BranchDetail;
