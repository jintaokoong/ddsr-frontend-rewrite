import { useEffect } from "react";

const useSubscribeScroll = (handleScroll: () => void) => {
  return useEffect(() => {
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);
};

export default useSubscribeScroll;
