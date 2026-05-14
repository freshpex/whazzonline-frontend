const numberFormatter = new Intl.NumberFormat('en-NG');

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export function formatCurrency(value: number) {
  return `\u20A6${numberFormatter.format(value)}`;
}
