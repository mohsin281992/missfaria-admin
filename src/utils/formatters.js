export const getCurrencySymbol = (currencySetting = 'PKR (Rs) - Pakistani Rupee') => {
  if (!currencySetting) return 'Rs';
  const match = currencySetting.match(/\((.*?)\)/);
  return match ? match[1] : 'Rs';
};

export const formatCurrency = (amount, currencySetting = 'PKR (Rs) - Pakistani Rupee') => {
  const symbol = getCurrencySymbol(currencySetting);
  const num = Number(amount) || 0;
  const needsSpace = symbol.length > 1 && !symbol.includes('$') && !symbol.includes('€') && !symbol.includes('£') && !symbol.includes('¥') && !symbol.includes('₩') && !symbol.includes('₺') && !symbol.includes('฿') && !symbol.includes('₪') && !symbol.includes('₫');
  return `${symbol}${needsSpace ? ' ' : ''}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
