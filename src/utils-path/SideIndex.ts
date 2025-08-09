export type SideIndex = number;

export const CONNECTION_TYPE_PLUG = "plug" as const;
export const CONNECTION_TYPE_SOCKET = "socket" as const;
export const CONNECTION_TYPE_NONE = "none" as const;

export type ConnectionType = typeof CONNECTION_TYPE_PLUG | typeof CONNECTION_TYPE_SOCKET | typeof CONNECTION_TYPE_NONE;

export const OppositeConnectionTypes = {
  [CONNECTION_TYPE_PLUG]: CONNECTION_TYPE_SOCKET,
  [CONNECTION_TYPE_SOCKET]: CONNECTION_TYPE_PLUG,
};
