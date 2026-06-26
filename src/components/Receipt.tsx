import type { Order } from '../types';

interface ReceiptProps {
  order: Order;
}

export default function Receipt({ order }: ReceiptProps) {
  return (
    <div className="print-receipt" style={{ position: 'absolute', left: '-9999px', top: 0 }}>
      <ReceiptContent order={order} />
    </div>
  );
}

export function ReceiptContent({ order }: { order: Order }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 8, paddingBottom: 8, borderBottom: '1px dashed #000' }}>
        <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>PizzaHub</div>
        <div style={{ fontSize: 10 }}>123 Pizza Street, Foodville</div>
        <div style={{ fontSize: 10 }}>Tel: (555) 123-4567</div>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 6 }}>
        <div style={{ fontWeight: 'bold', fontSize: 14 }}>SALES RECEIPT</div>
      </div>
      <div style={{ marginBottom: 6, paddingBottom: 6, borderBottom: '1px dashed #000', fontSize: 10 }}>
        <div>Invoice: {order.invoiceNumber}</div>
        <div>Date: {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
        <div>Cashier: {order.cashier}</div>
        {order.customerName !== 'Walk-in Customer' && <div>Customer: {order.customerName}</div>}
      </div>
      <table style={{ width: '100%', marginBottom: 6, fontSize: 10, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #000' }}>
            <th style={{ textAlign: 'left', padding: '2px 4px' }}>Item</th>
            <th style={{ textAlign: 'center', padding: '2px 4px', width: '30px' }}>Qty</th>
            <th style={{ textAlign: 'right', padding: '2px 4px', width: '50px' }}>Price</th>
            <th style={{ textAlign: 'right', padding: '2px 4px', width: '55px' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, i) => (
            <tr key={i}>
              <td style={{ textAlign: 'left', padding: '2px 4px' }}>{item.name}</td>
              <td style={{ textAlign: 'center', padding: '2px 4px' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right', padding: '2px 4px' }}>${item.price.toFixed(2)}</td>
              <td style={{ textAlign: 'right', padding: '2px 4px' }}>${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ borderTop: '1px dashed #000', paddingTop: 4, marginBottom: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '1px 0' }}><span>Subtotal:</span><span>${order.subtotal.toFixed(2)}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '1px 0', color: '#15803d' }}><span>Discount:</span><span>-${order.discount.toFixed(2)}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, padding: '1px 0' }}><span>Tax (8%):</span><span>${order.tax.toFixed(2)}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 14, marginTop: 4, paddingTop: 4, borderTop: '1px solid #000' }}><span>TOTAL:</span><span>${order.grandTotal.toFixed(2)}</span></div>
      </div>
      <div style={{ marginBottom: 6, paddingBottom: 6, borderBottom: '1px dashed #000', fontSize: 10 }}>
        <div>Payment: {order.paymentMethod}</div>
        {order.paymentMethod === 'Cash' && (
          <>
            <div>Received: ${order.amountReceived.toFixed(2)}</div>
            <div>Change: ${order.change.toFixed(2)}</div>
          </>
        )}
      </div>
      <div style={{ textAlign: 'center', fontSize: 10 }}>
        <p style={{ fontWeight: 'bold', margin: '0 0 2px' }}>Thank you for your order!</p>
        <p style={{ margin: '0', fontSize: 9 }}>Please come again</p>
        <p style={{ margin: '4px 0 0', fontSize: 9 }}>--- Powered by PizzaHub ---</p>
      </div>
    </div>
  );
}

export function ReceiptPreview({ order }: { order: Order }) {
  return (
    <div className="bg-white text-black p-6 rounded-xl max-w-sm mx-auto shadow-lg" style={{ fontFamily: "'Courier New', monospace", fontSize: 11 }}>
      <ReceiptContent order={order} />
    </div>
  );
}
