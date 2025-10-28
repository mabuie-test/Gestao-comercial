import { validationResult } from 'express-validator';
import Customer from '../models/Customer.js';

export const listCustomers = async (req, res) => {
  const { search } = req.query;
  const filter = {};
  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { phone: new RegExp(search, 'i') },
      { taxId: new RegExp(search, 'i') },
    ];
  }

  const customers = await Customer.find(filter).sort({ createdAt: -1 });
  return res.json(customers);
};

export const getCustomer = async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return res.status(404).json({ message: 'Cliente não encontrado' });
  }
  return res.json(customer);
};

export const createCustomer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const customer = await Customer.create(req.body);
  return res.status(201).json(customer);
};

export const updateCustomer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!customer) {
    return res.status(404).json({ message: 'Cliente não encontrado' });
  }

  return res.json(customer);
};
