export const generateUsername = (email) => {
  if (!email) return null;
  const index = email.indexOf('@');
  return email.slice(0, index);
};
