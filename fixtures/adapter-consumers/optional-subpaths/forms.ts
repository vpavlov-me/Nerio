import { useForm } from "@nerio/adapters/forms";

export type FormValues = { email: string };
export const createForm = () => useForm<FormValues>();
