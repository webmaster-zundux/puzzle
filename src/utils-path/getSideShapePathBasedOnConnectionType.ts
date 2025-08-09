import type { Path2dCommand } from "../models/path2d-commands/Path2dCommand";
import type { ConnectionType } from "./SideIndex";
import { CONNECTION_TYPE_NONE, CONNECTION_TYPE_PLUG, CONNECTION_TYPE_SOCKET } from "./SideIndex";
import { getPlugSideShape } from "./getPlugSideShape";
import { getSocketSideShape } from "./getSocketSideShape";
import { getStraightLineSideShape } from "./getStraightLineSideShape";

export const getSideShapePathBasedOnConnectionType = (
  connectionType: ConnectionType,
  angleInDegree: number = 0,
  sideShapeAsSocket: Path2dCommand[],
): Path2dCommand[] => {
  switch (connectionType) {
    case CONNECTION_TYPE_NONE: {
      return getStraightLineSideShape(angleInDegree);
    }
    case CONNECTION_TYPE_PLUG: {
      return getPlugSideShape(angleInDegree, sideShapeAsSocket);
    }
    case CONNECTION_TYPE_SOCKET: {
      return getSocketSideShape(angleInDegree, sideShapeAsSocket);
    }
  }
};
