import { CommonNode } from '@/types';

export const getContainerName = (node: CommonNode) =>
  `keep-n${node.networkId}-${node.name}`;
