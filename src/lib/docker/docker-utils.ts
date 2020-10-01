import { CommonNode, CommonApp } from '@/types';

export const getContainerName = (obj: CommonNode | CommonApp) =>
  `keep-n${obj.networkId}-${obj.name}`;
