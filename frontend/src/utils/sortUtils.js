export const sortData = (data, key, direction = "asc") => {
  if (!key) return data;
  const sorted = [...data].sort((a, b) => {
    const A = a[key];
    const B = b[key];
    if (typeof A === "string") {
      return direction === "asc" ? A.localeCompare(B) : B.localeCompare(A);
    }
    return direction === "asc" ? A - B : B - A;
  });
  return sorted;
};
