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
  'auth/missing-code': {
    field: 'code',
    message: 'Invalid verification code'
  },
  'auth/too-many-requests': {
    message: 'Too many attempts, try again later'
  },
  'auth/invalid-phone-number': {
    field: 'phone',
    message: 'Invalid phone number'
  },
  'auth/quota-exceeded': {
    message: 'Limit reached for sending verification code'
  }
};

export default firebaseCodeError;
