export const firebaseCodeError = {
  'auth/invalid-email': {
    field: 'email',
    message: 'Email format is invalid',
  },
  'auth/wrong-password': {
    field: 'password',
    message: 'Password is invalid',
  },
  'auth/user-not-found': {
    field: 'email',
    message: 'User not found',
  },
  'auth/popup-closed-by-user': {
    field: 'none',
    message: 'Connection aborted',
  },
  'auth/weak-password': {
    field: 'password',
    message: 'Password should be at least 6 characters',
  },
  'auth/email-already-in-use': {
    field: 'email',
    message: 'Email already in used',
  },
};

export default firebaseCodeError;
