export function cfxToObj(data: string[][]) {
  const fields = data.shift();
  return data.map((entry) =>
    Object.fromEntries(entry.map((value, index) => [fields[index], value])),
  );
}
