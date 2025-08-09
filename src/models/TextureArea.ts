export class TextureArea {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
  ) {}

  toString() {
    return `TextureArea {x: ${this.x}, y: ${this.y}, width: ${this.width}, height: ${this.height}}`;
  }
}
