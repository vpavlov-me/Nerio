import { useForm } from "@nerio-ui/adapters/forms";

export type FormValues = { email: string };
export const createForm = () => useForm<FormValues>();
