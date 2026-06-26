import type { Order } from '../types';

function generateReceiptHTML(order: Order): string {
  const rows = order.items.map((item) =>
    `<tr><td style="text-align:left;padding:2px 4px">${item.name}</td><td style="text-align:center;padding:2px 4px;width:30px">${item.quantity}</td><td style="text-align:right;padding:2px 4px;width:50px">Rs. ${item.price.toFixed(2)}</td><td style="text-align:right;padding:2px 4px;width:55px">Rs. ${(item.price * item.quantity).toFixed(2)}</td></tr>`
  ).join('');
  const cashLines = order.paymentMethod === 'Cash'
    ? `<div>Received: Rs. ${order.amountReceived.toFixed(2)}</div><div>Change: Rs. ${order.change.toFixed(2)}</div>`
    : '';
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Receipt ${order.invoiceNumber}</title><style>
    @page { size: 80mm auto; margin: 0; }
    body { font-family: 'Courier New', monospace; font-size: 12px; width: 80mm; padding: 8px; margin: 0; color: #000; background: #fff; }
    table { width: 100%; border-collapse: collapse; font-size: 10px; }
    th, td { padding: 2px 4px; }
  </style></head><body>
    <div style="text-align:center;margin-bottom:8px;padding-bottom:8px;border-bottom:1px dashed #000">
      <div style="font-size:18px;font-weight:bold;margin-bottom:2px">PizzaHub</div>
      <div style="font-size:10px">123 Pizza Street, Foodville</div>
      <div style="font-size:10px">Tel: (555) 123-4567</div>
    </div>
    <div style="text-align:center;margin-bottom:6px"><div style="font-weight:bold;font-size:14px">SALES RECEIPT</div></div>
    <div style="margin-bottom:6px;padding-bottom:6px;border-bottom:1px dashed #000;font-size:10px">
      <div>Invoice: ${order.invoiceNumber}</div>
      <div>Date: ${new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
      <div>Cashier: ${order.cashier}</div>
    </div>
    <table><thead><tr style="border-bottom:1px solid #000"><th style="text-align:left">Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr></thead><tbody>${rows}</tbody></table>
    <div style="border-top:1px dashed #000;padding-top:4px;margin-bottom:6px">
      <div style="display:flex;justify-content:space-between;font-size:10px;padding:1px 0"><span>Subtotal:</span><span>Rs. ${order.subtotal.toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:10px;padding:1px 0;color:#15803d"><span>Discount:</span><span>-Rs. ${order.discount.toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:10px;padding:1px 0"><span>Tax (8%):</span><span>Rs. ${order.tax.toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:14px;margin-top:4px;padding-top:4px;border-top:1px solid #000"><span>TOTAL:</span><span>Rs. ${order.grandTotal.toFixed(2)}</span></div>
    </div>
    <div style="margin-bottom:6px;padding-bottom:6px;border-bottom:1px dashed #000;font-size:10px">
      <div>Payment: ${order.paymentMethod}</div>${cashLines}
    </div>
    <div style="text-align:center;font-size:10px">
      <p style="font-weight:bold;margin:0 0 2px">Thank you for your order!</p>
      <p style="margin:0;font-size:9px">Please come again</p>
      <p style="margin:4px 0 0;font-size:9px">--- Powered by PizzaHub ---</p>
    </div>
  </body></html>`;
}

export function printOrder(order: Order) {
  const win = window.open('', '_blank');
  if (!win) { window.print(); return; }
  win.document.write(generateReceiptHTML(order));
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); win.close(); }, 300);
}
