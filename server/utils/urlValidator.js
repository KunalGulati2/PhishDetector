export const isValidUrl = (url) => {
  try {
    const hasProtocol = /^https?:\/\//i.test(url.trim());
    const normalizedUrl = hasProtocol ? url.trim() : `https://${url.trim()}`;
    new URL(normalizedUrl);
    return true;
  } catch {
    return false;
  }
};
