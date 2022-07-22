var classYearsMock = [];

for (let i = 1; i < 20; i++) {
  classYearsMock.push({
    id: i.toString(),
    yearPeriod: `${2000 + i}/${2000 + i + 1}`
  });
}

export default classYearsMock;
