import { useEffect, useMemo, useState } from 'react';
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
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CancelIcon from '@mui/icons-material/Cancel';
import dayjs from 'dayjs';
import api from '../services/api';
import DataTable from '../components/DataTable';
import type { Customer, Product, Sale } from '../types';

const emptyItem = { product: '', quantity: 1, unitPrice: 0, discount: 0 };

type SaleFormItem = typeof emptyItem;

const SalesPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ customer: '', items: [emptyItem] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const [salesRes, productsRes, customersRes] = await Promise.all([
      api.get<Sale[]>('/sales'),
      api.get<Product[]>('/products'),
      api.get<Customer[]>('/customers'),
    ]);
    setSales(salesRes.data);
    setProducts(productsRes.data);
    setCustomers(customersRes.data);
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const totals = useMemo(() => {
    const subtotal = form.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const discount = form.items.reduce((acc, item) => acc + (item.discount || 0), 0);
    const total = subtotal - discount;
    return { subtotal, discount, total };
  }, [form.items]);

  const handleChangeItem = (index: number, value: Partial<SaleFormItem>) => {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], ...value };
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, emptyItem] }));
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({ ...prev, items: prev.items.filter((_, idx) => idx !== index) }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await api.post('/sales', {
        customer: form.customer,
        items: form.items.map((item) => ({
          ...item,
          taxRate: 0,
        })),
        payment: { method: 'dinheiro', status: 'pago' },
      });
      setOpen(false);
      setForm({ customer: '', items: [emptyItem] });
      await load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registar venda');
    } finally {
      setSaving(false);
    }
  };

  const downloadInvoice = async (id: string) => {
    const response = await api.get(`/sales/${id}/invoice`, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  const cancelSale = async (id: string) => {
    await api.post(`/sales/${id}/cancelar`);
    await load();
  };

  return (
    <Stack spacing={4}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <div>
          <Typography variant="h4" fontWeight={700} mb={1}>
            Vendas e facturação
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gere facturas digitais com timbre e controlo de pagamentos.
          </Typography>
        </div>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Nova venda
        </Button>
      </Stack>
      <Card elevation={0} sx={{ borderRadius: 4 }}>
        <CardContent>
          <DataTable
            columns={[
              { key: 'invoiceNumber', label: 'Factura' },
              {
                key: 'customer',
                label: 'Cliente',
                render: (row) => row.customer.name,
              },
              {
                key: 'grandTotal',
                label: 'Total',
                render: (row) => `MZN ${row.grandTotal.toFixed(2)}`,
              },
              {
                key: 'createdAt',
                label: 'Data',
                render: (row) => dayjs(row.createdAt).format('DD/MM/YYYY HH:mm'),
              },
              {
                key: 'status',
                label: 'Estado',
              },
              {
                key: 'actions',
                label: 'Ações',
                render: (row) => (
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<PictureAsPdfIcon />}
                      onClick={() => downloadInvoice(row._id)}
                    >
                      PDF
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => cancelSale(row._id)}
                    >
                      Anular
                    </Button>
                  </Stack>
                ),
              },
            ]}
            rows={sales}
          />
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Registar nova venda</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={3}>
              <TextField
                select
                label="Cliente"
                value={form.customer}
                onChange={(event) => setForm((prev) => ({ ...prev, customer: event.target.value }))}
                required
              >
                {customers.map((customer) => (
                  <MenuItem key={customer._id} value={customer._id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </TextField>
              <Stack spacing={2}>
                {form.items.map((item, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4}>
                          <TextField
                            select
                            label="Produto"
                            value={item.product}
                            onChange={(event) => {
                              const product = products.find((prod) => prod._id === event.target.value);
                              handleChangeItem(index, {
                                product: event.target.value,
                                unitPrice: product?.salePrice ?? 0,
                              });
                            }}
                            fullWidth
                            required
                          >
                            {products.map((product) => (
                              <MenuItem key={product._id} value={product._id}>
                                {product.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <TextField
                            label="Qtd"
                            type="number"
                            value={item.quantity}
                            onChange={(event) =>
                              handleChangeItem(index, { quantity: Number(event.target.value) })
                            }
                            fullWidth
                            inputProps={{ min: 1 }}
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            label="Preço"
                            type="number"
                            value={item.unitPrice}
                            onChange={(event) =>
                              handleChangeItem(index, { unitPrice: Number(event.target.value) })
                            }
                            fullWidth
                            inputProps={{ min: 0 }}
                          />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <TextField
                            label="Desconto"
                            type="number"
                            value={item.discount}
                            onChange={(event) =>
                              handleChangeItem(index, { discount: Number(event.target.value) })
                            }
                            fullWidth
                            inputProps={{ min: 0 }}
                          />
                        </Grid>
                        <Grid item xs={12} md={1}>
                          <IconButton onClick={() => removeItem(index)} disabled={form.items.length === 1}>
                            ×
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
                <Button onClick={addItem} startIcon={<AddIcon />}>Adicionar linha</Button>
              </Stack>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Typography>Subtotal: MZN {totals.subtotal.toFixed(2)}</Typography>
                <Typography>Descontos: MZN {totals.discount.toFixed(2)}</Typography>
                <Typography fontWeight={700}>Total: MZN {totals.total.toFixed(2)}</Typography>
              </Stack>
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'A guardar...' : 'Emitir factura'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Stack>
  );
};

export default SalesPage;
