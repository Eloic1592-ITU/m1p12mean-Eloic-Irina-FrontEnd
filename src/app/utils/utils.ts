export function formatDateForInput(isoDate: string): string {
    if (!isoDate) return '';
    return isoDate.split('T')[0];
  }

export function formatDateTimeForInput(isoDate: string): string {
  if (!isoDate) return '';

  const date = new Date(isoDate);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}