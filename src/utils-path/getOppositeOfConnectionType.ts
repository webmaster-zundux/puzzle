import type { ConnectionType } from "./SideIndex";
import { CONNECTION_TYPE_PLUG, CONNECTION_TYPE_SOCKET, OppositeConnectionTypes } from "./SideIndex";

export const getOppositeOfConnectionType = (connetionType: ConnectionType): ConnectionType => {
  if (connetionType !== CONNECTION_TYPE_PLUG && connetionType !== CONNECTION_TYPE_SOCKET) {
    throw new Error("Error. Parameter connection type has to be a plug or a socket");
  }

  return OppositeConnectionTypes[connetionType];
};
