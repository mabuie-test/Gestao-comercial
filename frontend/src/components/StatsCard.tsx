import { Card, CardContent, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

const StatsCard = ({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
}) => (
  <Card elevation={0} sx={{ borderRadius: 4 }}>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 48,
            height: 48,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #0f766e 0%, #22d3ee 100%)',
            color: '#fff',
          }}
        >
          {icon}
        </Stack>
        <div>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            {value}
          </Typography>
          {description && (
            <Typography variant="caption" color="text.secondary">
              {description}
            </Typography>
          )}
        </div>
      </Stack>
    </CardContent>
  </Card>
);

export default StatsCard;
