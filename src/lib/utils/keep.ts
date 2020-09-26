import { BeaconNode, EcdsaNode } from '@/types';
import { getContainerName } from '../docker';
import { KEEP_ECDSA_PEER_IDS } from '../constants';

export const getKeepNodePeer = (node: BeaconNode | EcdsaNode) =>
  `/dns4/${getContainerName(node)}/tcp/3919/ipfs/${
    KEEP_ECDSA_PEER_IDS[node.id]
  }`;
