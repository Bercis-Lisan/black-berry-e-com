const DEFAULT_PRODUCT_COLORS = ['#1D1D1F', '#E3D9C6', '#3A5DFF'];

export function ensureProductColors(colors = []) {
  const availableColors = Array.isArray(colors) ? colors.filter(Boolean) : [];
  const distinctColors = [...new Set(availableColors)];

  DEFAULT_PRODUCT_COLORS.forEach((color) => {
    if (distinctColors.length < 3 && !distinctColors.includes(color)) {
      distinctColors.push(color);
    }
  });

  return distinctColors.slice(0, Math.max(3, availableColors.length));
}

export function formatRupees(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}
