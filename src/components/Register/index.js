import { useState } from 'react';
import styles from './Register.module.scss';
import { auth } from '../../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { HiOutlineUserCircle, HiOutlineLockClosed } from 'react-icons/hi2';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePassword = () => {
    let isValid = true;
    if (password !== '' && confirmPassword !== '') {
      if (password !== confirmPassword) {
        isValid = false;
        setError('Passwords does not match');
      }
    }
    return isValid;
  };

  const register = (e) => {
    e.preventDefault();
    if (validatePassword()) {
      // Create a new user with email and password using firebase
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          // setTimeActive(true);
          navigate('/dashboard');
        })
        .catch((err) => setError(err.message));
    }
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.login}>
        <h1 className={styles.title}>Welcome to Beat!</h1>
        {error && <div className="auth__error">{error}</div>}
        <form
          className={styles.form}
          onSubmit={register}
          name="registration_form"
        >
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
          </div>

          <div className={styles.inputField}>
            <label>Confirm Password</label>
            <div className={styles.input}>
              <HiOutlineLockClosed className={styles.icon} />
              <input
                type="password"
                placeholder="password"
                onChange={(e) => confirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className={styles.submit}>
            Register
          </button>
        </form>
        <span>
          Already have an account?{' '}
          <Link to="/">login</Link>
        </span>
      </div>
    </div>
  );
};

export default Register;
