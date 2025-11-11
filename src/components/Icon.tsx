import type { FC } from "react";
import type { IconProps } from "@models/components";
import { getIcon } from "@services/icons";

export const Icon: FC<IconProps> = ({ id, size, className, color = "000" }) => (
  <svg {...getIcon(id, size, color, className)}>
    <use href={`#icon_${id}`} />
  </svg>
);
