import type { FC } from "react";
import type { Icon } from "@models/icons";

interface IconAttrs {
  id: Icon;
  size: number;
  color?: string;
  className?: string;
}

export type IconProps = FC<IconAttrs>;
