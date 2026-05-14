import { useEffect, useState } from "react";

export const useInput = () => {
  const [input, setInput] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      setInput((prev) => ({ ...prev, [e.code]: true }));
    };

    const handleKeyUp = (e) => {
      setInput((prev) => ({ ...prev, [e.code]: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return input;
};