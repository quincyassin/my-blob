export const cutByLength = (str: string, maxBytes: number) => {
  return str.length > maxBytes ? str.slice(0, maxBytes) + "..." : str;
};
