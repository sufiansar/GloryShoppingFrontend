/**
 * Safe wrapper for browser storage (localStorage and sessionStorage)
 * to prevent crashes during SSR or in restricted environments.
 */

const isBrowser = typeof window !== "undefined";

const safeStorage = (type: "local" | "session") => {
  const getStorage = () => {
    if (!isBrowser) return null;
    try {
      return type === "local" ? window.localStorage : window.sessionStorage;
    } catch (e) {
      // SecurityError if storage is blocked
      return null;
    }
  };

  return {
    get: (key: string): string | null => {
      const storage = getStorage();
      if (!storage) return null;
      try {
        return storage.getItem(key);
      } catch (e) {
        return null;
      }
    },
    set: (key: string, value: string): boolean => {
      const storage = getStorage();
      if (!storage) return false;
      try {
        storage.setItem(key, value);
        return true;
      } catch (e) {
        return false;
      }
    },
    remove: (key: string): boolean => {
      const storage = getStorage();
      if (!storage) return false;
      try {
        storage.removeItem(key);
        return true;
      } catch (e) {
        return false;
      }
    },
  };
};

export const storage = {
  local: safeStorage("local"),
  session: safeStorage("session"),
};
