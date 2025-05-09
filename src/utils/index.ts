export const compareIds = (a: string | null, b: string | null) => {
  if (a === null && b === null) return false;
  if (a === null) return false;
  if (b === null) return true;
  return BigInt(a) > BigInt(b);
}

export const selectBiggest = (a: string | null, b: string | null) => {
  if (a === null && b === null) return null;
  if (a === null) return b;
  if (b === null) return a;
  return BigInt(a) > BigInt(b) ? a : b;
};

export const switchTheme = async (theme: "default") => {
  await import(`../styles/theme-${theme}.css`);

  document.documentElement.classList.forEach((cls) => {
    if (cls.startsWith('theme-')) {
      document.documentElement.classList.remove(cls);
    }
  });

  document.documentElement.classList.add(`theme-${theme}`);
}
