import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import api from '../services/api';
import type { Setting } from '../types';

const SettingsPage = () => {
  const [settings, setSettings] = useState<Setting | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await api.get<Setting>('/sales/settings');
      setSettings(response.data);
    };
    load().catch(console.error);
  }, []);

  const handleChange = (field: keyof Setting, value: string) => {
    setSettings((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!settings) return;
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      const response = await api.put<Setting>('/sales/settings', settings);
      setSettings(response.data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Não foi possível actualizar');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return <Typography>Carregando configurações...</Typography>;
  }

  return (
    <Stack spacing={4}>
      <div>
        <Typography variant="h4" fontWeight={700} mb={1}>
          Identidade da marca e timbre
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Personalize os dados exibidos nas facturas PDF e nos relatórios.
        </Typography>
      </div>
      <Card elevation={0} sx={{ borderRadius: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Nome da empresa"
                    value={settings.companyName}
                    onChange={(event) => handleChange('companyName', event.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="NUIT"
                    value={settings.companyTaxId ?? ''}
                    onChange={(event) => handleChange('companyTaxId', event.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Email"
                    value={settings.companyEmail ?? ''}
                    onChange={(event) => handleChange('companyEmail', event.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Telefone"
                    value={settings.companyPhone ?? ''}
                    onChange={(event) => handleChange('companyPhone', event.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <TextField
                label="Endereço"
                value={settings.companyAddress ?? ''}
                onChange={(event) => handleChange('companyAddress', event.target.value)}
                fullWidth
              />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Prefixo da factura"
                    value={settings.invoicePrefix ?? ''}
                    onChange={(event) => handleChange('invoicePrefix', event.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="URL do timbre"
                    value={settings.invoiceTimbreUrl ?? ''}
                    onChange={(event) => handleChange('invoiceTimbreUrl', event.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <TextField
                label="Notas na factura"
                value={settings.invoiceNotes ?? ''}
                onChange={(event) => handleChange('invoiceNotes', event.target.value)}
                fullWidth
                multiline
                rows={3}
              />
              {success && <Alert severity="success">Configurações actualizadas</Alert>}
              {error && <Alert severity="error">{error}</Alert>}
              <Stack direction="row" justifyContent="flex-end">
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? 'A actualizar...' : 'Guardar alterações'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default SettingsPage;
