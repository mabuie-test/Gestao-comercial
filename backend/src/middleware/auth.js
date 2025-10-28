import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token de acesso não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select('+password');

    if (!user || !user.active) {
      return res.status(401).json({ message: 'Utilizador inválido ou inactivo' });
    }

    req.user = user;
    user.lastAccessAt = new Date();
    await user.save();
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Sem permissões para executar esta acção' });
  }

  return next();
};
