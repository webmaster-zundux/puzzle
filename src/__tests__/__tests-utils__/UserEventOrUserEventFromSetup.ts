import type userEvent from "@testing-library/user-event";

export type UserEventOrUserEventFromSetup = typeof userEvent | ReturnType<typeof userEvent.setup>;
