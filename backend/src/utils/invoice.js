import PDFDocument from 'pdfkit';
import dayjs from 'dayjs';
import 'dayjs/locale/pt';

dayjs.locale('pt');

export const generateInvoicePdf = ({
  sale,
  response,
}) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  response.setHeader('Content-Type', 'application/pdf');
  response.setHeader('Content-Disposition', `attachment; filename=${sale.invoiceNumber}.pdf`);

  doc.pipe(response);

  const {
    companyName,
    companyTaxId,
    companyAddress,
    companyEmail,
    companyPhone,
    timbreUrl,
    currency = 'MZN',
  } = sale.metadata || {};

  doc
    .fontSize(18)
    .fillColor('#111827')
    .text(companyName || 'Empresa', { align: 'left' })
    .moveDown(0.25);

  if (companyTaxId) doc.fontSize(10).fillColor('#374151').text(`NUIT: ${companyTaxId}`);
  if (companyEmail) doc.text(`Email: ${companyEmail}`);
  if (companyPhone) doc.text(`Telefone: ${companyPhone}`);
  if (companyAddress) doc.text(`Endereço: ${companyAddress}`);

  if (timbreUrl) {
    doc.image(timbreUrl, 400, 45, { width: 150 }).moveDown(1);
  }

  doc
    .moveDown(0.5)
    .fontSize(16)
    .fillColor('#111827')
    .text(`Factura ${sale.invoiceNumber}`, { align: 'right' })
    .fontSize(10)
    .fillColor('#374151')
    .text(`Emissão: ${dayjs(sale.createdAt).format('DD/MM/YYYY HH:mm')}`, { align: 'right' });

  doc.moveDown(1);

  doc
    .fontSize(12)
    .fillColor('#111827')
    .text('Cliente', { underline: true })
    .moveDown(0.25);

  doc
    .fontSize(10)
    .text(`Nome: ${sale.customer?.name}`)
    .text(`NUIT: ${sale.customer?.taxId || 'N/A'}`)
    .text(`Email: ${sale.customer?.email || 'N/A'}`)
    .text(`Telefone: ${sale.customer?.phone || 'N/A'}`);

  doc.moveDown(0.5);

  const tableTop = doc.y + 10;
  const itemX = 50;
  const qtyX = 280;
  const priceX = 330;
  const totalX = 430;

  doc
    .fontSize(10)
    .fillColor('#111827')
    .text('Descrição', itemX, tableTop)
    .text('Qtd', qtyX, tableTop)
    .text('Preço', priceX, tableTop)
    .text('Total', totalX, tableTop);

  doc.moveTo(itemX, tableTop + 15).lineTo(550, tableTop + 15).stroke('#e5e7eb');

  let position = tableTop + 25;
  sale.items.forEach((item, index) => {
    const y = position + index * 20;
    doc
      .fillColor('#374151')
      .text(item.description, itemX, y, { width: 220 })
      .text(item.quantity, qtyX, y)
      .text(`${currency} ${item.unitPrice.toFixed(2)}`, priceX, y)
      .text(`${currency} ${item.total.toFixed(2)}`, totalX, y);
  });

  const summaryTop = tableTop + sale.items.length * 20 + 60;

  doc
    .moveTo(300, summaryTop - 15)
    .lineTo(550, summaryTop - 15)
    .stroke('#e5e7eb');

  doc
    .fontSize(10)
    .fillColor('#111827')
    .text('Subtotal:', 320, summaryTop)
    .text(`${currency} ${sale.subtotal.toFixed(2)}`, 450, summaryTop, { align: 'right' })
    .text('Impostos:', 320, summaryTop + 15)
    .text(`${currency} ${sale.taxTotal.toFixed(2)}`, 450, summaryTop + 15, { align: 'right' })
    .text('Descontos:', 320, summaryTop + 30)
    .text(`${currency} ${sale.discountTotal.toFixed(2)}`, 450, summaryTop + 30, { align: 'right' })
    .font('Helvetica-Bold')
    .text('Total a Pagar:', 320, summaryTop + 50)
    .text(`${currency} ${sale.grandTotal.toFixed(2)}`, 450, summaryTop + 50, { align: 'right' });

  doc
    .font('Helvetica')
    .moveDown(2)
    .fontSize(10)
    .fillColor('#9ca3af')
    .text('Condições de pagamento:', { underline: true })
    .moveDown(0.25)
    .fillColor('#374151')
    .text(
      sale.payment?.notes ||
        'Pagamento devido de acordo com os termos acordados. Obrigado pela preferência.'
    );

  if (sale.metadata?.invoiceNotes) {
    doc.moveDown(1).fillColor('#374151').text(sale.metadata.invoiceNotes);
  }

  doc.end();
};
