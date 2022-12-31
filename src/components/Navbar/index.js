import React from 'react';
import styles from './Navbar.module.scss';
import { logout } from '../../firebase';
import { generateUsername } from '../../utils/index';

const Navbar = (props) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.head}>
        <p className={styles.title}>
          Welcome back {generateUsername(props?.user?.email)}
        </p>
        <p className={styles.subTitle}>How are you doing?</p>
      </div>
      <button className={styles.logout} onClick={logout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
