import { useEffect } from "react";

export const useMount = (callback: (silent?: boolean) => void) => {
  useEffect(() => {
    callback(true); // Pass true to indicate silent refresh on mount
  }, []);
};
