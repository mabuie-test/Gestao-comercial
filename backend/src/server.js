import dotenv from 'dotenv';
import app from './app.js';
import { connectDatabase } from './config/database.js';
import User from './models/User.js';
import { getOrCreateDefaultSetting } from './services/invoiceService.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

const bootstrap = async () => {
  await connectDatabase(process.env.MONGODB_URI);

  const adminExists = await User.findOne({ role: 'admin' });
  if (!adminExists) {
    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@sistema.co.mz',
      password: 'admin123',
      role: 'admin',
    });
    await getOrCreateDefaultSetting(admin.id);
    // eslint-disable-next-line no-console
    console.log('👤 Utilizador admin padrão criado: admin@sistema.co.mz / admin123');
  }

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Servidor a correr na porta ${PORT}`);
  });
};

bootstrap();
