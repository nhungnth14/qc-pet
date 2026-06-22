export function formatQP(value: number): string {
  return `${value} QP`;
}

export function formatBC(value: number): string {
  return `${value} BC`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
