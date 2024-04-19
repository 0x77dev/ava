import { z } from "zod";

export const AgentKindSchema = z.enum(["native", "xml"])
export type AgentKind = z.infer<typeof AgentKindSchema>
