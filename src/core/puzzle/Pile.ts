import type { BaseEntityOptions, Id } from "./BaseEntity";
import { BaseEntity } from "./BaseEntity";
import type { Item, ItemOptions } from "./Item";

export const THE_SMALLEST_GROUP_SIZE = 2;
export const THE_LOWEST_INDEX_OF_ITEM = 0;

type Index = number;

export interface PileOptions extends BaseEntityOptions {}

export class Pile<UItem extends Item = Item, _UItemOptions extends ItemOptions = ItemOptions> extends BaseEntity {
  private _itemIdsInOrder = new Array<Id>();
  private _items = new Map<Id, UItem>();

  constructor({ ...restOptions }: PileOptions) {
    super(restOptions);
  }

  get itemIdOnTop(): Id | undefined {
    return this._itemIdsInOrder[this.length - 1];
  }
  get itemIdAtBottom(): Id | undefined {
    return this._itemIdsInOrder[0];
  }

  get itemOnTop(): UItem | undefined {
    const itemIdOnTop = this.itemIdOnTop;
    if (itemIdOnTop === undefined) {
      return undefined;
    }
    return this.getItemById(itemIdOnTop);
  }
  get itemAtBottom(): UItem | undefined {
    const itemIdAtBottom = this.itemIdAtBottom;
    if (itemIdAtBottom === undefined) {
      return undefined;
    }
    return this.getItemById(itemIdAtBottom);
  }

  get length(): number {
    return this._itemIdsInOrder.length;
  }

  get items() {
    return this._items;
  }

  getItemById(id: Id): UItem | undefined {
    return this._items.get(id);
  }

  get itemIdsInOrder(): Id[] {
    return new Array<Id>().concat(this._itemIdsInOrder);
  }

  private _clearItemIdsInOrder(): void {
    this._itemIdsInOrder = [];
  }

  private _clearItems(): void {
    this._items.clear();
  }

  clear(): void {
    this._clearItemIdsInOrder();
    this._clearItems();
  }

  getIndexOfItemIdInItemIdsOrderArrayById(id: Id): number | undefined {
    const indexOfItemIdInOrderArray = this._itemIdsInOrder.findIndex((pieceId) => pieceId === id);

    if (indexOfItemIdInOrderArray === -1) {
      return undefined;
    }

    return indexOfItemIdInOrderArray;
  }

  getIndexOfItemIdInPieceIdsOrderArray(item: UItem): number | undefined {
    if (!item) {
      throw new Error("Error. Parameter item is not defined");
    }

    if (!item?.id) {
      throw new Error("Error. Parameter item should has id attribute to be able be added to the pile");
    }

    return this.getIndexOfItemIdInItemIdsOrderArrayById(item.id);
  }

  getNextItemId(id: Id): Id | undefined {
    const indexOfItemId = this.getIndexOfItemIdInItemIdsOrderArrayById(id);

    if (indexOfItemId === undefined) {
      return undefined;
    }

    const indexOfNextItemId = indexOfItemId + 1;

    if (indexOfNextItemId >= this._itemIdsInOrder.length) {
      return undefined;
    }

    return this._itemIdsInOrder[indexOfNextItemId];
  }

  getPreviousItemId(id: Id): Id | undefined {
    const indexOfItemId = this.getIndexOfItemIdInItemIdsOrderArrayById(id);

    if (indexOfItemId === undefined) {
      return undefined;
    }

    const indexOfPreviousItemId = indexOfItemId - 1;

    if (indexOfPreviousItemId < 0) {
      return undefined;
    }

    return this._itemIdsInOrder[indexOfPreviousItemId];
  }

  getNextItem(item: UItem): UItem | undefined {
    if (!item?.id) {
      return undefined;
    }

    const nextItemId = this.getNextItemId(item.id);
    if (nextItemId === undefined) {
      return undefined;
    }

    return this.getItemById(nextItemId);
  }

  getPreviousItem(item: UItem): UItem | undefined {
    if (!item?.id) {
      return undefined;
    }

    const previousItemId = this.getPreviousItemId(item.id);
    if (previousItemId === undefined) {
      return undefined;
    }

    return this.getItemById(previousItemId);
  }

  moveToTop(item: UItem): void {
    if (!item) {
      throw new Error("Error. Parameter item is not defined");
    }

    if (!item?.id) {
      throw new Error("Error. Parameter item should has id attribute to be able be added to the pile");
    }

    if (!this.getItemById(item.id)) {
      throw new Error("Error. Parameter item should be in the pile");
    }

    if (!this._items.has(item.id)) {
      throw new Error("Error. No item with this id is in the pile");
    }

    if (!this._itemIdsInOrder.find((itemId) => itemId === item.id)) {
      throw new Error("Error. No itemId is in the pile");
    }

    const itemId = item.id;
    const indexOfItemId = this.getIndexOfItemIdInItemIdsOrderArrayById(itemId);

    if (indexOfItemId === undefined) {
      throw new Error("Error. Parameter item should has id that is in itemIdsInOrder attribute of the pile");
    }

    this._itemIdsInOrder.splice(indexOfItemId, 1);
    this._itemIdsInOrder.push(itemId);
  }

  addPieceOnTheTop(item: UItem, isRootPile = false): void {
    if (!item) {
      throw new Error("Error. Parameter item is not defined");
    }

    if (!item?.id) {
      throw new Error("Error. Parameter item should has id attribute to be able be added to the pile");
    }

    if (this._items.has(item.id)) {
      throw new Error("Error. Item with this id is already in the pile");
    }

    if (this._itemIdsInOrder.find((itemId) => itemId === item.id)) {
      throw new Error("Error. ItemId is already in the pile");
    }

    const itemId = item.id;

    this._items.set(itemId, item);
    this._itemIdsInOrder.push(itemId);

    this._setFunctionGetPieceByIdFromPile(item, isRootPile);
  }

  addGroupInTheMiddleByGroupSize(item: UItem, isRootPile = false): void {
    if (!item) {
      throw new Error("Error. Parameter item is not defined");
    }

    if (!item?.id) {
      throw new Error("Error. Parameter item should has id attribute to be able be added to the pile");
    }

    if (!item.nestedPile) {
      throw new Error("Error. Parameter item should be a group");
    }

    if (this._itemIdsInOrder.find((itemId) => itemId === item.id)) {
      throw new Error("Error. ItemId is already in the pile");
    }

    const groupSize = item.nestedPile.length;
    const indexOfTheUppermostGroupWithTheSameSize = this.getIndexOfTheUppermostGroupByGroupSize(groupSize);

    const itemId = item.id;
    this._items.set(itemId, item);

    this._itemIdsInOrder.splice(indexOfTheUppermostGroupWithTheSameSize + 1, 0, itemId);

    this._setFunctionGetPieceByIdFromPile(item, isRootPile);
  }

  getIndexOfTheUppermostGroupByGroupSize(groupSize: number = 0): number {
    if (groupSize < THE_SMALLEST_GROUP_SIZE) {
      return THE_LOWEST_INDEX_OF_ITEM;
    }

    if (!this.length) {
      return THE_LOWEST_INDEX_OF_ITEM;
    }

    const groupSizeMinusOne = groupSize - 1;
    const indexOfTheLowestGroupWithSizeMinusOne = this.findIndexFromBottomToTop((item): boolean => {
      if (!item.nestedPile) {
        return true;
      }

      if (item.nestedPile.length > groupSizeMinusOne) {
        return false;
      }

      return true;
    });

    if (indexOfTheLowestGroupWithSizeMinusOne === undefined) {
      return this.length;
    }

    const indexOfTheUppermostGroupWithTheSameSize = indexOfTheLowestGroupWithSizeMinusOne - 1;

    if (indexOfTheUppermostGroupWithTheSameSize < 0) {
      return THE_LOWEST_INDEX_OF_ITEM - 1;
    }

    return indexOfTheUppermostGroupWithTheSameSize;
  }

  private _setFunctionGetPieceByIdFromPile(item: UItem, isRootPile = false): void {
    item.getItemById = (id: Id) => this.getItemById(id);

    if (isRootPile) {
      item.getItemByIdFromRootPile = (id: Id) => this.getItemById(id);
    }
  }

  private _unsetFunctionGetPieceByIdFromPile(item: UItem): void {
    item.getItemById = (_itemId: Id) => undefined;
    item.getItemByIdFromRootPile = (_itemId: Id) => undefined;
  }

  removeItem(item: UItem): void {
    if (!item) {
      throw new Error("Error. Parameter item is not defined");
    }

    if (!item?.id) {
      throw new Error("Error. Parameter item should has id attribute to be able be removed from the pile");
    }

    if (!this._items.has(item.id)) {
      throw new Error("Error. No item with this id is in the pile");
    }

    const itemId = item.id;

    this._items.delete(itemId);

    const indexOfItemId = this.getIndexOfItemIdInPieceIdsOrderArray(item);
    if (indexOfItemId !== undefined) {
      this._itemIdsInOrder.splice(indexOfItemId, 1);
    }

    item.clearNestedPile();
    item.unsetParentPieceId();
    this._unsetFunctionGetPieceByIdFromPile(item);
  }

  cutItemFromItemIdsInOrder(item: UItem): Id {
    if (!item) {
      throw new Error("Error. Parameter item is not defined");
    }

    const indexOfItemId = this.getIndexOfItemIdInPieceIdsOrderArray(item);
    if (indexOfItemId === undefined) {
      throw new Error("Error. Item should be in the pile");
    }

    this._itemIdsInOrder.splice(indexOfItemId, 1);

    return item.id;
  }

  private _findSubFunction(index: number, predicate: (item: UItem, index: number) => boolean): UItem | undefined {
    if (typeof predicate !== "function") {
      throw new Error("Error. Parameter predicate should be a function");
    }

    const itemId = this._itemIdsInOrder[index];
    const item = this.getItemById(itemId);

    if (!item) {
      throw new Error(`Error. Item with id: ${itemId} should be in the pile, but it's only in itemIdsInOrder array`);
    }

    if (predicate(item, index)) {
      return item;
    }
  }

  findFromTopToBottom(predicate: (item: UItem, index: Index) => boolean): UItem | undefined {
    for (let index = this._itemIdsInOrder.length - 1; index >= 0; index--) {
      const desiredItem = this._findSubFunction(index, predicate);
      if (desiredItem) {
        return desiredItem;
      }
    }

    return undefined;
  }

  findIndexFromTopToBottom(predicate: (item: UItem, index: Index) => boolean): Index | undefined {
    for (let index = this._itemIdsInOrder.length - 1; index >= 0; index--) {
      const desiredItem = this._findSubFunction(index, predicate);
      if (desiredItem) {
        return index;
      }
    }

    return undefined;
  }

  findFromBottomToTop(predicate: (item: UItem, index: Index) => boolean): UItem | undefined {
    return this.find(predicate);
  }

  findIndexFromBottomToTop(predicate: (item: UItem, index: Index) => boolean): Index | undefined {
    return this.findIndex(predicate);
  }

  find(predicate: (item: UItem, index: Index) => boolean): UItem | undefined {
    for (let index = 0; index < this._itemIdsInOrder.length; index++) {
      const desiredItem = this._findSubFunction(index, predicate);
      if (desiredItem) {
        return desiredItem;
      }
    }

    return undefined;
  }

  findIndex(predicate: (item: UItem, index: Index) => boolean): Index | undefined {
    for (let index = 0; index < this._itemIdsInOrder.length; index++) {
      const desiredItem = this._findSubFunction(index, predicate);
      if (desiredItem) {
        return index;
      }
    }

    return undefined;
  }

  private _forEachSubFunction(index: number, predicate: (item: UItem) => void): void {
    if (typeof predicate !== "function") {
      throw new Error("Error. Parameter predicate should be a function");
    }

    const itemId = this._itemIdsInOrder[index];
    const item = this.getItemById(itemId);

    if (!item) {
      throw new Error(`Error. Item with id: ${itemId} should be in the pile, but it's only in itemIdsInOrder array`);
    }

    predicate(item);
  }

  forEachFromTopToBottom(predicate: (item: UItem) => void): void {
    for (let index = this._itemIdsInOrder.length - 1; index >= 0; index--) {
      this._forEachSubFunction(index, predicate);
    }
  }

  forEach(predicate: (item: UItem) => void): void {
    for (let index = 0; index < this._itemIdsInOrder.length; index++) {
      this._forEachSubFunction(index, predicate);
    }
  }

  toString(): string {
    return `${this.id}`;
  }
}
