import { CommandContext } from "@/services/command-context";

// Lấy tham số của Constructor nhưng LOẠI BỎ tham số `ctx: CommandContext` cuối cùng
type OmitContext<T extends any[]> = T extends [...infer Payload, CommandContext]
  ? Payload
  : T;

// Type helper chính: Lấy payload args của một Command Class
export type CommandPayload<T extends new (...args: any[]) => any> = OmitContext<
  ConstructorParameters<T>
>;