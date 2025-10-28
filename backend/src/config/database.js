import mongoose from 'mongoose';

export const connectDatabase = async (uri) => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, {
      autoIndex: true,
    });
    // eslint-disable-next-line no-console
    console.log('✅ Conectado ao MongoDB com sucesso');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Erro ao conectar ao MongoDB', error);
    process.exit(1);
  }
};
