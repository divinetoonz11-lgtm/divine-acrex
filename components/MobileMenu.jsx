import Link from "next/link";
import styles from "./MobileMenu.module.css";

export default function MobileMenu({ open, onClose, onPost }) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.menu} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>✕</button>

        <Link href="/" onClick={onClose}>Home</Link>
        <Link href="/listings" onClick={onClose}>Listings</Link>
        <Link href="/for-buyers" onClick={onClose}>For Buyers</Link>
        <Link href="/for-owners" onClick={onClose}>For Owners</Link>

        {/* ⭐ IMPORTANT CTA */}
        <Link
          href="/dealer/register"
          onClick={onClose}
          className={styles.dealerCta}
        >
          Become a Dealer
        </Link>

        <Link href="/insights" onClick={onClose}>Insights</Link>

        <button className={styles.postBtn} onClick={onPost}>
          Post Property <span>FREE</span>
        </button>
      </div>
    </div>
  );
}
