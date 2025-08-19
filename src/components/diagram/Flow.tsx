import type { FC } from "react";
import type { NodeTypes, EdgeTypes, Node, Edge } from "reactflow";

import { Icon } from "../Icon";
import React, { useCallback, useMemo } from "react";
import { MiniMap, Controls, Background, Panel } from "reactflow";
import ReactFlow, { useNodesState, useEdgesState } from "reactflow";

//  addEdge,
//  Connection,
import "reactflow/dist/style.css";
import { useSchema, useLayout } from "../../stores";
import { TableNode } from "./TableNode";
import { CustomEdge } from "./CustomEdge";

const Flow: FC = () => {
  const { schema, updateTablePosition } = useSchema();
  const { openDrawer } = useLayout();

  // Define custom node types
  const nodeTypes: NodeTypes = useMemo(() => ({ tableNode: TableNode }), []);
  const edgeTypes: EdgeTypes = useMemo(() => ({ custom: CustomEdge }), []);

  // Create nodes from tables
  const initialNodes: Node[] = useMemo(() => {
    return schema.tables.map((table) => ({
      id: table.id,
      type: "tableNode",
      position: table.position,
      data: table,
    }));
  }, [schema.tables]);

  // Create edges from relationships
  const initialEdges: Edge[] = useMemo(() => {
    return schema.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      label: edge.label,
      type: "custom",
      animated: true,
    }));
  }, [schema.edges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when schema changes
  React.useEffect(() => {
    setNodes(
      schema.tables.map((table) => ({
        id: table.id,
        type: "tableNode",
        position: table.position,
        data: table,
      })),
    );
  }, [schema.tables, setNodes]);

  // Update edges when schema changes
  React.useEffect(() => {
    setEdges(
      schema.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        label: edge.label,
        type: "custom",
        animated: true,
      })),
    );
  }, [schema.edges, setEdges]);

  // Handle node drag to update positions
  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      updateTablePosition(node.id, node.position);
    },
    [updateTablePosition],
  );

  // Handle adding a new table
  const handleAddTable = useCallback(() => {
    openDrawer("create");
  }, [openDrawer]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeDragStop={onNodeDragStop}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-right"
      >
        <Background />
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />

        <Panel position="top-right">
          <button className="btn btn-primary btn-md" onClick={handleAddTable}>
            <Icon id="plus" size={16} className="mr-1" />
            Table
          </button>
        </Panel>
      </ReactFlow>

      {/* Toast notification for command copying */}
      <div id="command-toast" className="toast toast-top toast-end hidden">
        <div className="alert alert-success">
          <span>Command copied to clipboard!</span>
        </div>
      </div>
    </div>
  );
};

export { Flow };
