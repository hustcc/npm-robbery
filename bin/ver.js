exports.parsePkgVer = pkg => {
  const idx = pkg.lastIndexOf('@');
  if (idx === -1 || idx === 0) {
    return [pkg];
  }

  return [pkg.substring(0, idx), pkg.substring(idx + 1)];
};
