// For validating and parsing YYYY-MM
exports.parseMonthParam = (monthParam) => {
  if (!monthParam || !/^\d{4}-(0[1-9]|1[0-2])$/.test(monthParam)) {
    return { error: "Invalid month format. Use YYYY-MM (e.g. 2025-09)" };
  }
  const [year, month] = monthParam.split("-").map(Number);
  return { year, month };
};