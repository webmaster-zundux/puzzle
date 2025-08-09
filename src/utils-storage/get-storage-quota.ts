/**
 * Returns Storage limit infomation
 *
 * usage - Number of bytes used
 *
 * quota - Maximum number of bytes available
 *
 * percentageUsed - percentage of quota usage
 *
 * remaining - number of remaining bytes until quota will be reached
 *
 * @returns undefined | { usage:number, quota:number, percentageUsed: number, remaining: number }
 */
export const getStorageQuota = async () => {
  if (!(navigator.storage && navigator.storage.estimate)) {
    return undefined;
  }

  const quota = await navigator.storage.estimate();
  if (quota.usage === undefined || quota.quota === undefined) {
    return undefined;
  }

  const percentageUsed = (quota.usage / quota.quota) * 100;
  const remaining = quota.quota - quota.usage;

  return {
    usage: quota.usage,
    quota: quota.quota,
    percentageUsed,
    remaining,
  };
};
