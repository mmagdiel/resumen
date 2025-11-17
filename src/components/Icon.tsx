import type { IconProps } from "@models/components";

import { getIcon } from "@services/icons";

export const Icon: IconProps = ({ id, size, className, color = "000" }) => (
  <svg {...getIcon(id, size, color, className)}>
    <use href={`#icon_${id}`} />
  </svg>
);
