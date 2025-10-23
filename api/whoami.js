const jwt = require('jsonwebtoken');

function getUserFromAuthHeader(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(auth.slice(7), 'TU_SECRETO');
  } catch (e) {
    return { error: e.message };
  }
}

module.exports = async (req, res) => {
  const user = getUserFromAuthHeader(req);
  if (!user) {
    return res.status(401).json({ error: 'No token or invalid token' });
  }
  return res.status(200).json({ user });
};


