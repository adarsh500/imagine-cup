import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, loginWithCredentials } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import styles from './Login.module.scss';
import { HiOutlineUserCircle, HiOutlineLockClosed } from 'react-icons/hi2';
import Typography from '@mui/material/Typography';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, isAuthloading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthloading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate('/dashboard');
  }, [user, isAuthloading, navigate]);

  const handleLogin = () => {
    loginWithCredentials(email, password);
    setLoading(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.login}>
        <h1 className={styles.title}>Welcome back to Beat!</h1>
        <div className={styles.form}>
          <div className={styles.inputField}>
            <label>Email</label>
            <div className={styles.input}>
              <HiOutlineUserCircle className={styles.icon} />
              <input
                type="email"
                placeholder="johndoe@xyz.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <p className={styles.errorMessage}>{error?.email}</p>
          </div>

          <div className={styles.inputField}>
            <label>Password</label>
            <div className={styles.input}>
              <HiOutlineLockClosed className={styles.icon} />
              <input
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className={styles.errorMessage}>{error?.password}</p>
          </div>

          {/* <Typography variant="body2" textAlign="right">
            <Link to="/reset">Forgot Password</Link>
          </Typography> */}
          <Typography variant="body2" textAlign="center" mt={2}>
            Don't have an account? <Link to="/register">Register</Link> now.
          </Typography>

          <button
            className={styles.submit}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Signing In' : 'Sign In'}
            {loading && <div className="lds-dual-ring"></div>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
