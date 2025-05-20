export function validateForm(fields, setError) {
  if (fields.username && fields.username.length < 3) {
    setError('Username must be at least 3 characters');
    return false;
  }
  if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    setError('Invalid email format');
    return false;
  }
  if (fields.password && fields.password.length < 6) {
    setError('Password must be at least 6 characters');
    return false;
  }
  if (fields.name && fields.name.length < 3) {
    setError('Name must be at least 3 characters');
    return false;
  }
  if (fields.title && fields.title.length < 3) {
    setError('Title must be at least 3 characters');
    return false;
  }
  if (fields.content && fields.content.length < 10) {
    setError('Content must be at least 10 characters');
    return false;
  }
  return true;
}