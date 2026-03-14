// Hàm đảo ngược instruction
export const reverseInstruction = (instr: string[]) => {
  return instr.map((i) => {
    if (i.startsWith("+")) return "-" + i.slice(1);
    if (i.startsWith("-")) return "+" + i.slice(1);
    return i; // Với prefix '!' (reset) thì cần xử lý kỹ hơn, hoặc hạn chế dùng khi back
  });
};
