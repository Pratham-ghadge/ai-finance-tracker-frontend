import React from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionForm from '../components/TransactionForm';

const AddTransaction = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/transactions');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Transaction</h1>
        <p className="text-gray-600 mt-2">Record your income or expense</p>
      </div>

      <TransactionForm onSuccess={handleSuccess} />
    </div>
  );
};

export default AddTransaction;