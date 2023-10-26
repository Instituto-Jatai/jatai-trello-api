export const formatDate = (date: string) => {
  const dateToFormat = new Date(date);

  // Obter o dia, mês e ano
  const day = dateToFormat.getDate(); // O dia do mês
  const month = dateToFormat.getMonth() + 1; // O mês (começa de 0, então adicionamos 1)
  const year = dateToFormat.getFullYear(); // O ano

  return `${String(day).padStart(2, "0")}/${String(month).padStart(
    2,
    "0"
  )}/${year}`;
};

export const getTotalDaysPastDue = (date: string) => {
  const today = new Date();
  const dataDue = new Date(date);

  const milliseconds = today.getTime() - dataDue.getTime();
  return Math.floor(milliseconds / (1000 * 60 * 60 * 24));
};
