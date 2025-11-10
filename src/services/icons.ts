import type { GetIcon } from "@models/services";
import { mapperIcon } from "@models/icons";

export const getIcon: GetIcon = (icon, size, color) => {
  const fill = `#${color}`;
  const width = `${size}px`;
  const height = `${size}px`;
  const viewBox = mapperIcon[icon];
  return { viewBox, width, height, fill };
};
