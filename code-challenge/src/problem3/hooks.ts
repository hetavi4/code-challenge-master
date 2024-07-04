// hooks.ts

import { useEffect, useState } from 'react';

export const useWalletBalances = () => {
  const [balances, setBalances] = useState<WalletBalance[]>([]);//Assume it is defined in another file

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const response = await fetch('API_ENDPOINT'); // Replace with actual endpoint
        const data = await response.json();
        setBalances(data);
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    };

    fetchBalances();
  }, []);

  return balances;
};
