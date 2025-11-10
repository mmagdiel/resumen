import { useEffect } from "react";
import { useLayout } from "@/stores/useLayout";
import { Icon } from "../Icon";

const Theme = () => {
  const { selectedTheme, toggleTheme } = useLayout();
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", selectedTheme);
  }, [selectedTheme]);
  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle"
    >
      {selectedTheme === "light" ? (
        <Icon id="moon" size={20} />
      ) : (
        <Icon id="sun" size={20} />
      )}
    </button>
  );
};

export { Theme };
