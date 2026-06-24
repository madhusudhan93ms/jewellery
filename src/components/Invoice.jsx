import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPrinter, FiDownload } from 'react-icons/fi';

function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

export default function Invoice({ order, onClose }) {
  const printRef = useRef();

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open('', '_blank', 'width=900,height=700');
    win.document.write(`
      <html>
        <head>
          <title>VJS Invoice - ${order.invoiceNumber}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Georgia', serif; color: #1a1a1a; background: #fff; }
            .invoice-wrapper { max-width: 800px; margin: 0 auto; padding: 40px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #b8860b; padding-bottom: 24px; margin-bottom: 32px; }
            .logo { font-size: 36px; font-weight: bold; color: #b8860b; letter-spacing: 4px; }
            .company-info { font-size: 11px; color: #666; line-height: 1.6; }
            .invoice-title { font-size: 28px; color: #b8860b; letter-spacing: 2px; text-align: right; }
            .invoice-meta { font-size: 12px; color: #444; text-align: right; margin-top: 6px; }
            .section { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 32px; }
            .section-label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #b8860b; font-weight: bold; margin-bottom: 8px; }
            .section-value { font-size: 13px; line-height: 1.8; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            thead th { background: #b8860b; color: #fff; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
            tbody tr:nth-child(even) { background: #fdf8ec; }
            tbody td { padding: 10px 12px; font-size: 12px; border-bottom: 1px solid #eee; }
            .totals { margin-left: auto; width: 280px; }
            .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
            .total-row.grand { border-top: 2px solid #b8860b; padding-top: 12px; margin-top: 8px; font-size: 16px; font-weight: bold; color: #b8860b; }
            .payment-badge { display: inline-block; background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; }
            .footer { margin-top: 48px; border-top: 1px solid #ddd; padding-top: 20px; display: flex; justify-content: space-between; font-size: 11px; color: #999; }
            .watermark { text-align: center; color: #b8860b; opacity: 0.08; font-size: 80px; font-weight: bold; position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(-30deg); z-index: -1; letter-spacing: 10px; }
            @media print { body { -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <div class="watermark">VJS</div>
          <div class="invoice-wrapper">${printContents}</div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  if (!order) return null;

  const subtotal = order.subtotal || order.total;
  const gst = order.gst || 0;
  const grandTotal = order.total;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto py-8 px-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-3xl rounded-lg shadow-2xl overflow-hidden"
        >
          {/* Action Bar */}
          <div className="flex items-center justify-between bg-gray-900 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-gold font-display text-lg tracking-widest">VJS</span>
              <span className="text-white/60 text-sm">Invoice Preview</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-gold text-white px-4 py-2 rounded text-sm font-semibold hover:bg-gold/90 transition-colors"
              >
                <FiPrinter size={15} />
                Print / Save PDF
              </button>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors p-1"
              >
                <FiX size={22} />
              </button>
            </div>
          </div>

          {/* Invoice Content */}
          <div className="p-8 bg-white" ref={printRef}>
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-gold pb-6 mb-8">
              <div>
                <div className="text-4xl font-bold text-gold tracking-widest mb-2">VJS</div>
                <div className="text-xs text-gray-500 leading-relaxed">
                  VJS Jewellery — Timeless Elegance, Crafted Forever<br />
                  123, Jewellers Street, Hyderabad, Telangana — 500001<br />
                  GSTIN: 36AABCV1234F1Z5 &nbsp;|&nbsp; CIN: U74999TG2020PTC123456<br />
                  Email: support@vjsjewellery.com &nbsp;|&nbsp; Phone: +91-9999999999
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gold tracking-widest mb-1">TAX INVOICE</div>
                <div className="text-sm text-gray-600 space-y-0.5">
                  <div><span className="text-gray-400">Invoice #:</span> <strong className="text-gray-900">{order.invoiceNumber}</strong></div>
                  <div><span className="text-gray-400">Order ID:</span> {order.id}</div>
                  <div><span className="text-gray-400">Date:</span> {formatDate(order.createdAt)}</div>
                  <div className="mt-2">
                    <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold ${
                      order.paymentMethod === 'Razorpay'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {order.paymentMethod === 'Razorpay' ? '✓ PAID ONLINE' : '💵 CASH ON DELIVERY'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bill To / Ship To */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-gold mb-2">Bill To</div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  <div className="font-semibold text-gray-900">{order.userName}</div>
                  <div>{order.userEmail}</div>
                </div>
              </div>
              {order.shippingAddress && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gold mb-2">Ship To</div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    <div className="font-semibold text-gray-900">{order.shippingAddress.fullName}</div>
                    <div>{order.shippingAddress.address}</div>
                    <div>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</div>
                    <div>Phone: {order.shippingAddress.phone}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Items Table */}
            <table className="w-full mb-6 text-sm">
              <thead>
                <tr className="bg-gold text-white">
                  <th className="py-3 px-4 text-left text-xs uppercase tracking-wider">#</th>
                  <th className="py-3 px-4 text-left text-xs uppercase tracking-wider">Item Description</th>
                  <th className="py-3 px-4 text-center text-xs uppercase tracking-wider">Qty</th>
                  <th className="py-3 px-4 text-right text-xs uppercase tracking-wider">Unit Price</th>
                  <th className="py-3 px-4 text-right text-xs uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/40'}>
                    <td className="py-3 px-4 text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      {item.category && (
                        <div className="text-xs text-gray-400">{item.category}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">{formatPrice(item.price)}</td>
                    <td className="py-3 px-4 text-right font-semibold">{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>GST (3% — Jewellery)</span>
                  <span>{formatPrice(gst)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gold border-t-2 border-gold pt-3 mt-3">
                  <span>Grand Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            {order.paymentId && (
              <div className="bg-green-50 border border-green-200 rounded p-4 mb-6 text-sm">
                <span className="text-green-700 font-medium">Payment ID: </span>
                <span className="text-green-900 font-mono">{order.paymentId}</span>
              </div>
            )}

            {/* Order Status */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs text-gray-500">Order Status:</span>
              <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {order.status}
              </span>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 pt-6 flex justify-between items-end">
              <div className="text-xs text-gray-400 leading-relaxed max-w-xs">
                <div className="font-semibold text-gray-600 mb-1">Terms & Conditions</div>
                <div>All jewellery is hallmarked. Returns accepted within 7 days of delivery. This is a computer-generated invoice and does not require a signature.</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold/20 tracking-widest">VJS</div>
                <div className="text-xs text-gray-400">Thank you for your purchase!</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
