import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaymentsIcon from '@mui/icons-material/Payments';
import WarningIcon from '@mui/icons-material/WarningAmber';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatsCard from '../components/StatsCard';
import api from '../services/api';
import type { DashboardMetrics } from '../types';

const DashboardPage = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await api.get<DashboardMetrics>('/sales/dashboard');
      setMetrics(response.data);
    };
    load().catch(console.error);
  }, []);

  const chartData = metrics?.latestSales.map((sale) => ({
    name: sale.invoiceNumber,
    total: sale.grandTotal,
  }));

  return (
    <Stack spacing={4}>
      <Typography variant="h4" fontWeight={700} color="text.primary">
        Resumo inteligente
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Vendas totais"
            value={metrics?.salesCount ?? 0}
            icon={<TrendingUpIcon />}
            description="Transacções concluídas"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Receita"
            value={`MZN ${(metrics?.totalRevenue ?? 0).toFixed(2)}`}
            icon={<ReceiptLongIcon />}
            description="Montante facturado"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Pagamentos pendentes"
            value={metrics?.pendingPayments ?? 0}
            icon={<PaymentsIcon />}
            description="Facturas por liquidar"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Alertas de stock"
            value={metrics?.lowStock ?? 0}
            icon={<WarningIcon />}
            description="Produtos abaixo do nível"
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Últimas vendas
              </Typography>
              <Box height={280}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f766e" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip cursor={false} />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#0f766e"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Actividade recente
              </Typography>
              <Stack spacing={2}>
                {metrics?.latestSales.map((sale) => (
                  <Stack key={sale._id} spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography fontWeight={600}>{sale.invoiceNumber}</Typography>
                      <Typography color="text.secondary">
                        MZN {sale.grandTotal.toFixed(2)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        {sale.customer.name}
                      </Typography>
                      <Chip label={sale.status} size="small" color="primary" variant="outlined" />
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default DashboardPage;
