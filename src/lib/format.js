const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const formatUsd = (value) => usd.format(value);

// "$3,500/mo", "From $12,000"
export function formatPackagePrice({ price, period, pricePrefix }) {
  const amount = formatUsd(price);
  return [pricePrefix, period ? `${amount}/${period}` : amount].filter(Boolean).join(" ");
}
