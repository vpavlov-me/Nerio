import { z } from "@nerio/adapters/schema";

export const schema = z.object({ email: z.string().email() });
