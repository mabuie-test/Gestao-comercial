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
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/AddCircleOutline';
import api from '../services/api';
import DataTable from '../components/DataTable';
import type { Product } from '../types';

const categories = ['Electrónica', 'Alimentar', 'Serviços', 'Moda'];

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    costPrice: 0,
    salePrice: 0,
    stock: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const response = await api.get<Product[]>('/products');
    setProducts(response.data);
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await api.post('/products', form);
      setOpen(false);
      setForm({ name: '', sku: '', category: '', costPrice: 0, salePrice: 0, stock: 0 });
      await load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar produto');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={4}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <div>
          <Typography variant="h4" fontWeight={700} mb={1}>
            Catálogo e stock inteligente
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Centralize o controlo de inventário com alertas automáticos.
          </Typography>
        </div>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Novo produto
        </Button>
      </Stack>
      <Card elevation={0} sx={{ borderRadius: 4 }}>
        <CardContent>
          <DataTable
            columns={[
              { key: 'name', label: 'Produto' },
              { key: 'sku', label: 'SKU' },
              {
                key: 'salePrice',
                label: 'Preço venda',
                render: (row) => `MZN ${row.salePrice.toFixed(2)}`,
              },
              {
                key: 'stock',
                label: 'Stock',
              },
              {
                key: 'category',
                label: 'Categoria',
              },
            ]}
            rows={products}
          />
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar novo produto</DialogTitle>
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
                label="SKU"
                value={form.sku}
                onChange={(event) => setForm((prev) => ({ ...prev, sku: event.target.value }))}
                required
              />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Preço de custo"
                    type="number"
                    value={form.costPrice}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, costPrice: Number(event.target.value) }))
                    }
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Preço de venda"
                    type="number"
                    value={form.salePrice}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, salePrice: Number(event.target.value) }))
                    }
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Stock inicial"
                    type="number"
                    value={form.stock}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, stock: Number(event.target.value) }))
                    }
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Categoria"
                    value={form.category}
                    onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                    fullWidth
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              {error && <Alert severity="error">{error}</Alert>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'A guardar...' : 'Guardar produto'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Stack>
  );
};

export default ProductsPage;
