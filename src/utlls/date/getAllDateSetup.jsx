export const getAllDateSetup = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const date = new Date();
  const startLocal = startDate.toLocaleDateString();
  const endLocal = endDate.toLocaleDateString();
  const startGetDate = startDate.getDate();
  const endGetDate = endDate.getDate();
  const startGetDay = startDate.getDay();
  const endGetDay = endDate.getDay();
  const dateGetDate = date.getDate();
  const dateGetDay = date.getDay();
  const dateLocal = date.toLocaleDateString();

  return {
    startLocal,
    endLocal,
    startGetDate,
    endGetDate,
    startGetDay,
    endGetDay,
    dateGetDate,
    dateGetDay,
    dateLocal,
  };
};

export default getAllDateSetup;
