export const ALLOWED_MIME_TYPES = ["image/*"];

export const isAllowedMimeType = (type: string): boolean => {
  if (type in ALLOWED_MIME_TYPES) {
    return true;
  }

  const acceptedByRegExp = ALLOWED_MIME_TYPES.find((allowedMimeType) => new RegExp(`^${allowedMimeType}`).test(type));
  if (acceptedByRegExp) {
    return true;
  }

  return false;
};
