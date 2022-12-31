import React, { useEffect } from 'react';
import {
  HiOutlineUserCircle,
  HiOutlineUser,
  HiOutlineChartBar,
  HiOutlineInboxStack,
  HiOutlineDocumentText,
} from 'react-icons/hi2';
import Navbar from '../Navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateUsername } from '../../utils/index';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import styles from './Layout.module.scss';

const Layout = (props) => {
  const collections = [
    { label: 'Account', icon: <HiOutlineUser className={styles.right} /> },
    {
      label: 'Dashboard',
      icon: <HiOutlineInboxStack className={styles.right} />,
    },
    {
      label: 'Reports',
      icon: <HiOutlineDocumentText className={styles.right} />,
    },
    {
      label: 'Analytics',
      icon: <HiOutlineChartBar className={styles.right} />,
    },
  ];
  const location = useLocation();
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  return (
    <div>
      <div className={styles.home}>
        <aside className={styles.sidebar}>
          {/* <div> */}
          <img
            className={styles.logo}
            src="/logo-no-background.svg"
            alt="logo"
          />
          {/* </div> */}

          <span variant="outlined" className={styles.coll}>
            <div className={styles.collectionInfo}>
              <HiOutlineUserCircle className={styles.right} />
              <p className={styles.collectionName}>
                {generateUsername(user?.email)}
              </p>
            </div>
          </span>

          <menu className={styles.menu}>
            {collections.map(({ label, icon }) => {
              return (
                <span
                  className={
                    location.pathname.slice(1) === label.toLowerCase()
                      ? styles.collActive
                      : styles.coll
                  }
                >
                  <div className={styles.collectionInfo}>
                    {icon}
                    <p className={styles.collectionName}>{label}</p>
                  </div>
                </span>
              );
            })}
          </menu>
        </aside>

        <div className={styles.mainContent}>
          <Navbar user={user} />

          {props.children}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Layout);
