import type { FC } from "react";
import type { Alert } from "@models/alerts";

interface AlertAtrrs {
  id: Alert;
  size: number;
  label: string;
}

export type AlertProps = FC<AlertAtrrs>;
