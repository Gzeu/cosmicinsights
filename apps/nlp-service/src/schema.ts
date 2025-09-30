import { z } from "zod";

export const InstructionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("GrantRole"),
    user: z.string().regex(/^erd1[0-9a-z]+$/, "invalid address"),
    role: z.string().min(1)
  }),
  z.object({
    type: z.literal("RevokeRole"),
    user: z.string().regex(/^erd1[0-9a-z]+$/),
    role: z.string().min(1)
  }),
  z.object({
    type: z.literal("ExecuteAction"),
    roleRequired: z.string().min(1),
    action: z.string().min(1)
  })
]);
export type Instruction = z.infer<typeof InstructionSchema>;