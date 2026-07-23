export function isPublicProductionDeployment() {
  const vercelEnvironment = process.env.VERCEL_ENV;

  if (vercelEnvironment) return vercelEnvironment === "production";

  return process.env.NODE_ENV === "production";
}
