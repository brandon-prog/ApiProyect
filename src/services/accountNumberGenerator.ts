export function generateAccountNumber(): string {
  const timestamp = Date.now().toString().slice(-8); // Últimos 8 dígitos del timestamp
  const randomDigits = Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
  return timestamp + randomDigits; // Total: 14 dígitos
}
