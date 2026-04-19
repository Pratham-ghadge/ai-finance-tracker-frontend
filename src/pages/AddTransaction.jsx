import { useNavigate } from 'react-router-dom';
import TransactionForm from '../components/TransactionForm';

const AddTransaction = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <section className="hero-panel">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Fallback entry</p>
          <h1 className="mt-3 text-3xl font-semibold">Record a transaction manually when import is not available</h1>
        </div>
      </section>
      <TransactionForm onSuccess={() => navigate('/transactions')} />
    </div>
  );
};

export default AddTransaction;
