// WalletPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useWalletBalances } from './hooks'; // Adjust path as needed
import WalletRow from './WalletRow'; // Adjust path as needed


interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

class Datasource {
  constructor(private apiUrl: string) {}

  async getPrices(): Promise<{ [currency: string]: number }> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching prices:', error);
      throw error;
    }
  }
}

const WalletPage: React.FC = () => {
  const balances = useWalletBalances(); // Custom hook to fetch wallet balances
  const [prices, setPrices] = useState<{ [currency: string]: number }>({});

  useEffect(() => {
    const fetchPrices = async () => {
      const datasource = new Datasource("https://interview.switcheo.com/prices.json");
      try {
        const fetchedPrices = await datasource.getPrices();
        setPrices(fetchedPrices);
      } catch (error) {
        console.error('Error fetching prices:', error);
        // Handle error gracefully, e.g., show error message to user
      }
    };
    fetchPrices();
  }, []);

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    const filteredBalances = balances.filter((balance: WalletBalance) => balance.amount <= 0);
    return filteredBalances.sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      return rightPriority - leftPriority; // Sort descending by priority
    });
  }, [balances]);

  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => ({
      ...balance,
      formatted: balance.amount.toFixed()
    }));
  }, [sortedBalances]);

  return (
    <div>
      {formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
        let usdValue = prices[balance.currency] * balance.amount;
        return (
          <WalletRow
            key={index}
            currency={balance.currency}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        );
      })}
    </div>
  );
};

export default WalletPage;
