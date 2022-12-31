import React from 'react';
import styles from './Navbar.module.scss';
import { logout } from '../../firebase';

const Navbar = (props) => {
  return (
    <nav className={styles.navbar}>
      {/* <p>{name}</p> */}
      {/* <p>Logged in as {user?.email}</p>  */}
      <div className={styles.head}>
        <p className={styles.title}>Welcome back {props?.user?.email}</p>
        <p className={styles.subTitle}>How are you doing?</p>
      </div>
      <button className={styles.logout} onClick={logout}>
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
