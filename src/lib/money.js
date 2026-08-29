/* Prices are in CFA francs. The franc has no subunit in practice, so amounts
   are whole numbers and the symbol trails the value: "12 500 FCFA". */
const nf = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

export const money = v => `${nf.format(Math.round(Number(v) || 0))} FCFA`;

/* Prices step in hundreds — nobody prices a dish at 3 501 FCFA. */
export const PRICE_STEP = 100;
