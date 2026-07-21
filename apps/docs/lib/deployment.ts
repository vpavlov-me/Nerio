export function isPublicProductionDeployment() {
  const vercelEnvironment = process.env.VERCEL_ENV;

  if (vercelEnvironment) return vercelEnvironment === "production";

  return process.env.NODE_ENV === "production";
}

export function isHostedDeployment() {
  const vercelEnvironment = process.env.VERCEL_ENV;

  if (vercelEnvironment) {
    return vercelEnvironment === "preview" || vercelEnvironment === "production";
  }

  return process.env.NODE_ENV === "production";
}
