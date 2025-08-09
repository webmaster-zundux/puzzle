const key = "isolation-example";

export const read = (): string | null => {
  return localStorage.getItem(key);
};

export const write = (data: string) => {
  localStorage.setItem(key, data);

  return { key: data };
};

export const clear = () => {
  localStorage.clear();
};
