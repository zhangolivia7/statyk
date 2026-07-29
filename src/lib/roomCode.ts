// avoid ambiguous characters (0/O, 1/I/L) so codes are easy to read and type
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 6;

export function generateRoomCode(): string {
    let code = "";
    for (let i = 0; i < CODE_LENGTH; i++) {
        code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }
    return code;
}

// join-box input should match generated codes regardless of case/whitespace
export function normalizeRoomCode(input: string): string {
    return input.trim().toUpperCase();
}
