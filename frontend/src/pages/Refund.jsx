export default function Refund(){
  return (
    <>
      <div className="max-w-4xl mx-auto px-6 py-20 text-slate-300">
      <h1 className="text-3xl font-bold text-white mb-8">Refund & Cancellation Policy</h1>
      
      <h2 className="text-xl font-bold text-white mt-8 mb-4">Cancellation</h2>
      <p>Orders once placed cannot be cancelled after the kitchen has started preparing the food (usually within 5 minutes of order placement).</p>
      
      <h2 className="text-xl font-bold text-white mt-8 mb-4">Refunds</h2>
      <p>Refunds are only processed if:</p>
      <ul className="list-disc ml-6 mt-2 space-y-2">
        <li>The order was not delivered.</li>
        <li>Items were missing from your order.</li>
        <li>The packaging was tampered with at the time of delivery.</li>
      </ul>
      <p className="mt-4">Approved refunds will be credited to your original payment method within 5-7 business days.</p>
    </div>
    </>
  )
}