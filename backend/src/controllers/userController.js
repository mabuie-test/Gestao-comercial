import { validationResult } from 'express-validator';
import User from '../models/User.js';

export const listUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  return res.json(users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt,
    lastAccessAt: user.lastAccessAt,
  })));
};

export const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name, role, active } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: 'Utilizador não encontrado' });
  }

  if (user.id === req.user.id && role && role !== user.role) {
    return res.status(400).json({ message: 'Não é permitido alterar o próprio perfil' });
  }

  if (name) user.name = name;
  if (role) user.role = role;
  if (typeof active === 'boolean') user.active = active;

  await user.save();

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active,
  });
};

export const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { password } = req.body;

  const user = await User.findById(id).select('+password');
  if (!user) {
    return res.status(404).json({ message: 'Utilizador não encontrado' });
  }

  user.password = password;
  await user.save();

  return res.json({ message: 'Senha actualizada com sucesso' });
};
