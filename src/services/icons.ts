import type { GetIcon } from "@models/services";
import { mapperIcon } from "@models/icons";

export const getIcon: GetIcon = (icon, size, color, className) => {
  const fill = `#${color}`;
  const width = `${size}px`;
  const height = `${size}px`;
  const viewBox = mapperIcon[icon];

  if (className && color) return { viewBox, width, height, fill, className };
  if (className) return { viewBox, width, height, className };
  if (color) return { viewBox, width, height, fill };
  return { viewBox, width, height };
};
