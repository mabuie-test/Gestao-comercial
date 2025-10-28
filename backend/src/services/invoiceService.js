import Setting from '../models/Setting.js';

export const getOrCreateDefaultSetting = async (userId) => {
  let setting = await Setting.findOne();

  if (!setting) {
    setting = await Setting.create({
      companyName: process.env.DEFAULT_COMPANY_NAME || 'Empresa',
      companyTaxId: process.env.DEFAULT_COMPANY_TAX_ID || '000000000',
      companyEmail: process.env.DEFAULT_COMPANY_EMAIL || 'info@empresa.co.mz',
      companyPhone: process.env.DEFAULT_COMPANY_PHONE || '+258 84 000 0000',
      companyAddress: process.env.DEFAULT_COMPANY_ADDRESS || 'Maputo',
      createdBy: userId,
    });
  }

  return setting;
};

export const generateInvoiceNumber = async (userId) => {
  const setting = await getOrCreateDefaultSetting(userId);
  const invoiceNumber = `${setting.invoicePrefix}${String(setting.nextInvoiceNumber).padStart(5, '0')}`;
  setting.nextInvoiceNumber += 1;
  await setting.save();
  return { invoiceNumber, setting };
};
