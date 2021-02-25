import React from "react";

export function useIsMounted() {
  const isMountedRef = React.useRef(true);
  const isMounted = React.useCallback(() => isMountedRef.current, []);

  React.useEffect(() => {
    return () => {
        isMountedRef.current = false;
    }
  }, []);

  return isMounted;
}