import styles from "./index.module.css";

interface OpeningEffectProps {
  children: React.ReactNode;
}

export const OpeningEffect: React.FC<OpeningEffectProps> = ({ children }) => {
  return (
    <div className={styles.crtEffect}>
      <div className={styles.crtContent}>{children}</div>
    </div>
  );
};
