import React, { useState } from 'react';

interface TreeNode {
  label: string;
  children?: TreeNode[];
}

const sampleTreeData: TreeNode[] = [
  {
    label: 'Proyecto A',
    children: [{ label: 'Carpeta 1' }, { label: 'Carpeta 2' }],
  },
  {
    label: 'Proyecto B',
    children: [{ label: 'Subproyecto 1' }, { label: 'Subproyecto 2' }],
  },
];

const ProjectsTree: React.FC = () => {
  // Podrías manejar un estado de nodos expandidos aquí
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

  const toggleNode = (label: string) => {
    setExpandedNodes((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const renderTree = (nodes: TreeNode[]) => {
    return nodes.map((node) => {
      const isExpanded = expandedNodes.includes(node.label);
      const hasChildren = node.children && node.children.length > 0;

      return (
        <div key={node.label}>
          <div
            className="cursor-pointer hover:bg-gray-200 px-2 py-1"
            onClick={() => {
              if (hasChildren) toggleNode(node.label);
            }}
          >
            {hasChildren && (
              <span className="mr-1">{isExpanded ? '▼' : '▶'}</span>
            )}
            {node.label}
          </div>
          {hasChildren && isExpanded && (
            <div className="pl-4">{renderTree(node.children!)}</div>
          )}
        </div>
      );
    });
  };

  return <div>{renderTree(sampleTreeData)}</div>;
};

export default ProjectsTree;
