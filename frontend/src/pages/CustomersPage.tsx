import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAddAlt';
import api from '../services/api';
import DataTable from '../components/DataTable';
import type { Customer } from '../types';

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', taxId: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const response = await api.get<Customer[]>('/customers');
    setCustomers(response.data);
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await api.post('/customers', form);
      setOpen(false);
      setForm({ name: '', email: '', phone: '', taxId: '' });
      await load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar cliente');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={4}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <div>
          <Typography variant="h4" fontWeight={700} mb={1}>
            Clientes e fidelização
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Acompanhe históricos de compras para campanhas personalizadas.
          </Typography>
        </div>
        <Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setOpen(true)}>
          Novo cliente
        </Button>
      </Stack>
      <Card elevation={0} sx={{ borderRadius: 4 }}>
        <CardContent>
          <DataTable
            columns={[
              { key: 'name', label: 'Nome' },
              { key: 'email', label: 'Email' },
              { key: 'phone', label: 'Telefone' },
              { key: 'taxId', label: 'NUIT' },
            ]}
            rows={customers}
          />
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar cliente</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                label="Nome"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              />
              <TextField
                label="Telefone"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
              <TextField
                label="NUIT"
                value={form.taxId}
                onChange={(event) => setForm((prev) => ({ ...prev, taxId: event.target.value }))}
              />
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'A guardar...' : 'Guardar cliente'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Stack>
  );
};

export default CustomersPage;
