import { useState, useEffect } from "react";
import { useSchema } from "@/stores/useSchema";

const DiagramNameInput = () => {
  const { schema, setDiagramName } = useSchema();
  const [localValue, setLocalValue] = useState(schema.name);

  // Sync with store when it changes externally
  useEffect(() => {
    setLocalValue(schema.name);
  }, [schema.name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = () => {
    if (localValue.trim()) {
      setDiagramName(localValue.trim());
    } else {
      // Reset to current schema name if empty
      setLocalValue(schema.name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <input
      type="text"
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder="Click to name your diagram..."
      className="input input-ghost text-center text-lg font-semibold max-w-md w-full focus:input-bordered transition-all"
      aria-label="Diagram name"
    />
  );
};

export { DiagramNameInput };
