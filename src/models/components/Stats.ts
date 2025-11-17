import type { FC } from "react";

interface StatAttrs {
  name: string;
  nodes: number;
  edges: number;
}

export type StatProps = FC<StatAttrs>;
