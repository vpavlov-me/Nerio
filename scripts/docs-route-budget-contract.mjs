export const routeBudgetFields = ["jsBytes", "cssBytes", "transferBytes"];

export function routeBudgetFailures(routes, budgets) {
  const failures = [];
  for (const route of routes) {
    const budget = budgets.routes?.[route.route];
    if (!budget) {
      failures.push(`${route.route}: missing route budget`);
      continue;
    }
    for (const field of routeBudgetFields) {
      const allowance = budget[field];
      if (!Number.isFinite(allowance) || allowance < 0) {
        failures.push(`${route.route}: ${field} budget must be a finite nonnegative number`);
        continue;
      }
      if (route[field] > allowance) {
        failures.push(`${route.route}: ${field} ${route[field]}/${allowance} bytes`);
      }
    }
  }
  return failures;
}
