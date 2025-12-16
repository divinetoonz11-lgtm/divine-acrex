import Link from "next/link";
import styles from "./MobileMenu.module.css";

export default function MobileMenu({ open, onClose, onPost }) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>✕</button>

        <Link href="/listings" onClick={onClose}>Listings</Link>
        <Link href="/for-buyers" onClick={onClose}>For Buyers</Link>
        <Link href="/for-tenants" onClick={onClose}>For Tenants</Link>
        <Link href="/for-owners" onClick={onClose}>For Owners</Link>
        <Link href="/for-dealers" onClick={onClose}>For Dealers</Link>
        <Link href="/insights" onClick={onClose}>Insights</Link>

        <button className={styles.postBtn} onClick={onPost}>
          Post Property <span>FREE</span>
        </button>
      </div>
    </div>
  );
}
