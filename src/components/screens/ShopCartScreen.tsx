import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  ShoppingBag,
  ShoppingCart,
  Trash2,
  CreditCard,
  Building2,
  Check,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ShopProduct } from '../../types';

export const ShopCartScreen: React.FC = () => {
  const {
    cart,
    products,
    currency,
    setCurrency,
    formatCurrency,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    checkout,
    setActiveTab,
  } = useData();

  const [paymentGateway, setPaymentGateway] = useState<'Stripe' | 'Razorpay' | 'Bank Transfer'>('Stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState<string | null>(null);

  const cartTotalGbp = cart.reduce((sum, item) => sum + item.unit_price_gbp * item.quantity, 0);
  const cartTotalInr = cart.reduce((sum, item) => sum + item.unit_price_inr * item.quantity, 0);

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const order = checkout(paymentGateway);
      setIsProcessing(false);
      if (order) {
        setCheckoutComplete(order.invoice_number);
      }
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Platform Shop & Bilateral Services
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Live Checkout Simulator
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Purchase add-on sponsorship packages, newsletter promotional credits, event delegate passes, and trade mission seats.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-xl ">
          <button
            onClick={() => setCurrency('GBP')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currency === 'GBP' ? 'bg-amber-500 text-slate-950 ' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            £ GBP (United Kingdom)
          </button>
          <button
            onClick={() => setCurrency('INR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currency === 'INR' ? 'bg-amber-500 text-slate-950 ' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ₹ INR (India Corridors)
          </button>
        </div>
      </div>

      {/* Checkout Success Alert */}
      {checkoutComplete && (
        <div className="bg-emerald-50 border-2 border-emerald-500/80 rounded-2xl p-6  flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold">
              ✓
            </div>
            <div>
              <h3 className="text-base font-semibold text-emerald-950">
                Payment Processed & Invoice Generated!
              </h3>
              <p className="text-xs text-emerald-800">
                Invoice <strong>{checkoutComplete}</strong> has been logged to the central database ledger.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
            >
              View Invoices &rarr;
            </button>
            <button
              onClick={() => setCheckoutComplete(null)}
              className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main 2-Column: Catalog on Left, Cart & Checkout on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Products Catalog */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-600" />
            Add-on Packages & Trade Subscriptions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-cream border border-line rounded-lg p-5  hover: transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {product.category}
                    </span>
                    <span className="text-base font-semibold text-slate-900">
                      {formatCurrency(product.price_gbp, product.price_inr)}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{product.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {product.description}
                  </p>
                </div>

                <button
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      title: product.title,
                      type: 'Add-on',
                      unit_price_gbp: product.price_gbp,
                      unit_price_inr: product.price_inr,
                      quantity: 1,
                    })
                  }
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold  transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Active Shopping Cart & Checkout */}
        <div className="space-y-6">
          <div className="bg-cream border border-line rounded-lg p-5  space-y-4 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-amber-600" />
                Your Cart ({cart.length})
              </h2>
              {cart.length > 0 && (
                <button
                  onClick={() => cart.forEach((i) => removeFromCart(i.id))}
                  className="text-[11px] font-bold text-rose-600 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <ShoppingBag className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">Your shopping cart is empty.</p>
                <p className="text-[11px]">Select a package or plan to proceed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="pt-2 flex items-start justify-between gap-2 text-xs">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-900">{item.title}</p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {formatCurrency(item.unit_price_gbp, item.unit_price_inr)} each
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-slate-200 rounded-lg">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-slate-500 hover:bg-slate-100 rounded-l"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-slate-500 hover:bg-slate-100 rounded-r"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals */}
                <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(cartTotalGbp, cartTotalInr)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Chamber VAT / GST:</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-slate-900 pt-2 border-t border-slate-100">
                    <span>Total Payable:</span>
                    <span className="text-amber-600">
                      {formatCurrency(cartTotalGbp, cartTotalInr)}
                    </span>
                  </div>
                </div>

                {/* Payment Gateway Selector */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    Select Payment Gateway
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    <button
                      onClick={() => setPaymentGateway('Stripe')}
                      className={`p-2 rounded-xl border font-bold text-center transition-all ${
                        paymentGateway === 'Stripe'
                          ? 'border-amber-500 bg-amber-50/50 text-slate-950'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Stripe UK (£)
                    </button>
                    <button
                      onClick={() => setPaymentGateway('Razorpay')}
                      className={`p-2 rounded-xl border font-bold text-center transition-all ${
                        paymentGateway === 'Razorpay'
                          ? 'border-amber-500 bg-amber-50/50 text-slate-950'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Razorpay (₹)
                    </button>
                    <button
                      onClick={() => setPaymentGateway('Bank Transfer')}
                      className={`p-2 rounded-xl border font-bold text-center transition-all ${
                        paymentGateway === 'Bank Transfer'
                          ? 'border-amber-500 bg-amber-50/50 text-slate-950'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      BACS / Wire
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full py-3 bg-ink text-cream hover:bg-ink-2 font-semibold rounded-xl text-xs  transition-all flex items-center justify-center gap-1.5"
                >
                  {isProcessing ? (
                    <span>Processing Gateway...</span>
                  ) : (
                    <>
                      <span>Simulate checkout ({formatCurrency(cartTotalGbp, cartTotalInr)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const OrdersInvoicesScreen: React.FC = () => {
  const { currentRole, can, orders, markOrderComplimentary, refundOrder, formatCurrency, exportSheetCSV } = useData();

  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const canManageBilling = can('manage_billing_refunds');

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              Orders, Invoices & Finance Ledger
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {orders.length} Invoices
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time audit log of membership billings, delegate mission tickets, and multi-currency transactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportSheetCSV('Orders')}
            className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold  transition-colors"
          >
            Export Ledger CSV
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-cream border border-line rounded-lg  overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-900 text-slate-200 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="px-4 py-3">Invoice Number</th>
                <th className="px-4 py-3">Buyer & Organisation</th>
                <th className="px-4 py-3">Items Summary</th>
                <th className="px-4 py-3">Gateway & Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                    {ord.invoice_number}
                  </td>

                  <td className="px-4 py-3.5">
                    <p className="font-bold text-slate-900">{ord.buyer_name}</p>
                    <p className="text-[11px] text-slate-500">{ord.organisation_name}</p>
                  </td>

                  <td className="px-4 py-3.5 max-w-xs truncate text-slate-700 font-medium">
                    {ord.items_summary}
                  </td>

                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-slate-900">{ord.gateway}</p>
                    <p className="text-[11px] text-slate-500">
                      {new Date(ord.created_at).toLocaleDateString()}
                    </p>
                  </td>

                  <td className="px-4 py-3.5 font-extrabold text-slate-900 text-sm">
                    {formatCurrency(ord.total)}
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'Complimentary'
                          ? 'bg-purple-100 text-purple-800'
                          : ord.status === 'Refunded'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedInvoice(ord)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs"
                      >
                        Print Invoice
                      </button>

                      {canManageBilling && ord.status === 'Paid' && (
                        <>
                          <button
                            onClick={() => markOrderComplimentary(ord.id)}
                            className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold rounded-lg text-[10px]"
                            title="Mark as Complimentary (Staff Override)"
                          >
                            Complimentary
                          </button>
                          <button
                            onClick={() => refundOrder(ord.id)}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-lg text-[10px]"
                            title="Simulate Gateway Refund"
                          >
                            Refund
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-cream border border-line rounded-lg w-full max-w-2xl  p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-semibold text-sm">
                    NY
                  </div>
                  <div>
                    <h2 className="font-extrabold text-slate-900 text-base">NPH / YABA</h2>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                      Northern Powerhouse & Yorkshire Asian Business Association
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="font-semibold text-base text-slate-900">
                  {selectedInvoice.invoice_number}
                </span>
                <p className="text-slate-500">
                  Date: {new Date(selectedInvoice.created_at).toLocaleDateString()}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Status: {selectedInvoice.status}
                </span>
              </div>
            </div>

            {/* Billed To */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">
                  Billed To:
                </span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">
                  {selectedInvoice.organisation_name}
                </p>
                <p className="text-slate-600">Attn: {selectedInvoice.buyer_name}</p>
                <p className="text-slate-500 font-mono">Org ID: {selectedInvoice.organisation_id}</p>
              </div>

              <div className="text-right">
                <span className="text-slate-400 font-bold uppercase text-[10px] block">
                  Payment Details:
                </span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  Gateway: {selectedInvoice.gateway}
                </p>
                <p className="text-slate-600">Currency: {selectedInvoice.currency}</p>
              </div>
            </div>

            {/* Line Items */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-900 text-white p-3 font-bold flex justify-between">
                <span>Description / Item</span>
                <span>Amount</span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">{selectedInvoice.items_summary}</p>
                  <p className="text-[11px] text-slate-500">Official bilateral chamber program</p>
                </div>
                <span className="text-base font-semibold text-slate-900">
                  {formatCurrency(selectedInvoice.total)}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-xs text-slate-400">
                Official UK-India Chamber Transaction Record
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs"
                >
                  Print PDF
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
