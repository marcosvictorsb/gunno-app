/* eslint-disable no-undef */
const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonth = () => new Date().getMonth();

const getCurrentQuarter = () => {
  const month = getCurrentMonth();
  const quarter = Math.floor((month + 3) / 3);
  return `Q${quarter}`;
};

export { getCurrentYear, getCurrentQuarter };
