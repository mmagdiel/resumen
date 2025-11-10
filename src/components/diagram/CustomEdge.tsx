import type { FC } from "react";
import type { EdgeProps } from "reactflow";

import { getSmoothStepPath, EdgeLabelRenderer } from "reactflow";

const CustomEdge: FC<EdgeProps> = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  label,
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={{ ...style, strokeWidth: 2 }}
        className="stroke-secondary fill-none"
        d={edgePath}
        markerEnd={markerEnd}
      />

      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="bg-base-200 rounded px-2 py-1 text-xs shadow-sm border border-base-300 nodrag"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export { CustomEdge };
