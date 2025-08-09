export interface PositionDeltaCreation {
  dx: number;
  dy: number;
}

export class PositionDelta {
  constructor(
    public dx: number,
    public dy: number,
  ) {}

  static create({ dx, dy }: PositionDeltaCreation): PositionDelta {
    return new this(dx, dy);
  }

  static reverse({ dx, dy }: PositionDelta): PositionDelta {
    return this.create({ dx: -dx, dy: -dy });
  }

  static zeroDelta() {
    return new PositionDelta(0, 0);
  }
}
