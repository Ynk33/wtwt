const shortNames: Record<string, string> = {
  'united states of america': 'US',
  'united kingdom': 'UK',
};

export const shortName = (name: string): string => {
  return shortNames[name.toLowerCase()] || name;
};
