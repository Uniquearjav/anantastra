/**
 * Formats a number using the Indian numbering system (lakhs, crores)
 * Examples: 10000 -> 10,000; 100000 -> 1,00,000; 1000000 -> 10,00,000
 */
export const formatIndianNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  
  const value = Math.round(num).toString();
  let lastThree = value.substring(value.length - 3);
  let otherNumbers = value.substring(0, value.length - 3);
  
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
};

/**
 * Formats a number as Indian currency (₹)
 * Examples: 10000 -> ₹10,000; 100000 -> ₹1,00,000
 */
export const formatIndianCurrency = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '₹0';
  return '₹' + formatIndianNumber(num);
};

/**
 * Formats a number as US currency ($)
 * Examples: 10000 -> $10,000; 100000 -> $100,000
 */
export const formatUSDCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Formats a number with a specific currency symbol
 * @param {number} num - The number to format
 * @param {string} currency - Currency code (INR, USD, etc.)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (num, currency = 'INR') => {
  if (currency === 'INR') {
    return formatIndianCurrency(num);
  }
  
  // For other currencies, use Intl formatter
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};