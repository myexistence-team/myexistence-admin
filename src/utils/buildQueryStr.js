function buildQueryStr(route, query) {
  var queryStr = `${route}?`;
  for (const key in query) {
    if (query[key] !== undefined && query[key] !== null && query[key] !== "") {
      queryStr += `${key}=${encodeURIComponent(query[key])}&`;
    }
  }
  return queryStr.slice(0, -1);
}

export default buildQueryStr;
