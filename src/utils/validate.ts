export function isValidEmail(email: string): boolean {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(email);
}

export function isPositiveNumber(n: number): boolean {
  return typeof n === 'number' && n > 0;
}
