import styles from "./BranchDetail.module.css";

const BranchDetail = ({ branch }) => {
  return (
    <div className={styles.branchDetail}>
      <h3>{branch.branchName}</h3>
      <img src={branch.image} alt="Setor" />
    </div>
  );
};

export default BranchDetail;
