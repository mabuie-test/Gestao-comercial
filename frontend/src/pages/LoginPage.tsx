import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@sistema.co.mz');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
    } catch (err) {
      setError('Não foi possível autenticar. Verifique as credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack minHeight="100vh" alignItems="center" justifyContent="center" sx={{ background: 'linear-gradient(135deg,#0f766e 0%,#2563eb 100%)' }}>
      <Card sx={{ width: 400, borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
            Gestão Comercial
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            Faça login para aceder ao painel inteligente de vendas.
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Palavra-passe"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
                required
              />
              {error && <Alert severity="error">{error}</Alert>}
              <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? 'A autenticar...' : 'Entrar'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default LoginPage;
