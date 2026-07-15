import { z } from "@nerio-ui/adapters/schema";

export const schema = z.object({ email: z.string().email() });
