export const getCurrencySymbol = (currencySetting = 'USD ($) - US Dollar') => {
  if (!currencySetting) return '$';
  const match = currencySetting.match(/\((.*?)\)/);
  return match ? match[1] : '$';
};

export const formatCurrency = (amount, currencySetting = 'USD ($) - US Dollar') => {
  const symbol = getCurrencySymbol(currencySetting);
  const num = Number(amount) || 0;
  const needsSpace = symbol.length > 1 && !symbol.includes('$') && !symbol.includes('€') && !symbol.includes('£') && !symbol.includes('¥') && !symbol.includes('₩') && !symbol.includes('₺') && !symbol.includes('฿') && !symbol.includes('₪') && !symbol.includes('₫');
  return `${symbol}${needsSpace ? ' ' : ''}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
