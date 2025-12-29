import React from "react";
import Link from "next/link";
import styles from "./ServicesSection.module.css";

const SERVICES = [
  { id: 1, name: "Residential Property", sub: "Buy & sell apartments, villas, builder floors and independent homes", img: "/images/featured-1.png", link: "/services/residential" },
  { id: 2, name: "Commercial Property", sub: "Buy, sell & lease offices, shops, showrooms and commercial spaces", img: "/images/featured-2.png", link: "/services/commercial" },
  { id: 3, name: "Hotel & Resort Services", sub: "Buying, selling and investment in hotels and resorts", img: "/images/featured-3.png", link: "/services/hotel-resort" },
  { id: 4, name: "PG & Co-Living", sub: "Managed PGs and shared living spaces for students and professionals", img: "/images/featured-4.png", link: "/services/pg-coliving" },
  { id: 5, name: "Buy Plots / Land", sub: "Residential and commercial land acquisition services", img: "/images/featured-5.png", link: "/services/plots-land" },
  { id: 6, name: "Post Property", sub: "List your property to connect with verified buyers and tenants faster", img: "/images/featured-6.png", link: "/post-property" },
  { id: 7, name: "Hotel Management Services", sub: "End-to-end hotel operations and professional management support", img: "/images/featured-7.png", link: "/services/hotel-management" },
  { id: 8, name: "Legal Services", sub: "Property documentation, agreements and legal compliance assistance", img: "/images/featured-8.png", link: "/services/legal" },
  { id: 9, name: "Astrology Services", sub: "Property astrology and guidance for confident decision-making", img: "/images/featured-9.png", link: "/services/astrology" },
  { id: 10, name: "Vastu Consultant", sub: "Expert vastu planning for homes and commercial properties", img: "/images/featured-10.png", link: "/services/vastu" },
];

export default function ServicesSection() {
  return (
    <section className={styles["svc-root"]}>
      <div className={styles["svc-wrap"]}>
        <h2 className={styles["svc-title"]}>Explore our services</h2>

        <div className={styles["svc-grid-5"]}>
          {SERVICES.map((s) => (
            <Link key={s.id} href={s.link} className={styles["svc-link"]}>
              <article className={styles["svc-card"]}>
                <img src={s.img} alt={s.name} className={styles["svc-thumb"]} />
                <div className={styles["svc-name"]}>{s.name}</div>
                <div className={styles["svc-sub"]}>{s.sub}</div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
