import type { BaseEntityOptions, Id } from "./BaseEntity";
import { BaseEntity } from "./BaseEntity";
import type { Pile } from "./Pile";

export interface ItemOptions extends BaseEntityOptions {}

class Item<_TItem extends BaseEntity = BaseEntity, TItemOptions extends ItemOptions = ItemOptions> extends BaseEntity {
  private _parentPieceId?: Id;

  private _nestedPile?: Pile<this, TItemOptions>;

  getItemById?: (id: Id) => this | undefined;
  getItemByIdFromRootPile?: (id: Id) => this | undefined;

  get nestedPile() {
    return this._nestedPile;
  }
  setNestedPile(pile: Pile<this, TItemOptions>) {
    this._nestedPile = pile;
  }
  clearNestedPile() {
    if (typeof this._nestedPile?.clear === "function") {
      this._nestedPile.clear();
    }
  }
  hasNestedPile(): boolean {
    return Boolean(this._nestedPile) && Boolean(this._nestedPile?.length);
  }

  get parentPieceId() {
    return this._parentPieceId;
  }
  setParentPieceId(pieceId: Id) {
    this._parentPieceId = pieceId;
  }
  unsetParentPieceId() {
    this._parentPieceId = undefined;
  }
  hasParentPieceId(): boolean {
    return Boolean(this._parentPieceId);
  }

  toString(): string {
    return `${this.id}`;
  }
}

export { Item };
