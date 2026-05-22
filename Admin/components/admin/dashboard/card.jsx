import React from 'react';
import styles from './Card.module.css';

const Card_dashboard = ({ title, value, percentage, icon }) => {
  const isPositive = percentage > 0;

  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}>
        {/* Placeholder for actual icon, use an SVG or Font Awesome */}
        {icon}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.value}>{value}</p>
      {/* <div className={`${styles.percentage} ${isPositive ? styles.positive : styles.negative}`}>
        {Math.abs(percentage)}% {isPositive ? '↑' : '↓'}
      </div> */}
    </div>
  );
};

export default Card_dashboard;