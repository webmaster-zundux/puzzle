export function createInstanceWithOptions<T extends NonNullable<unknown>, Options = NonNullable<unknown>>(
  ctr: new (args: Options) => T,
  options: Options,
): T {
  return new ctr(options);
}

export type Id = string;

export interface BaseEntityOptions {
  id: Id;
}

export class BaseEntity {
  public id: Id;

  constructor({ id }: BaseEntityOptions) {
    this.id = id;
  }
}
