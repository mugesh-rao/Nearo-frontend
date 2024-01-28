export const formatDateTime = (dateObject) => {
  let dateObj = dateObject ? new Date(dateObject * 1000) : null;
  // let utcString = dateObj.toLocaleString();

  return dateObj;
};
