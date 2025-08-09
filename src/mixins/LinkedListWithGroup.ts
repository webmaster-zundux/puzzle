import type { LinkedListPosition, LinkedListPositionAfterItem, LinkedListPositionOnTheEndsOfList } from "./LinkedList";
import { BasicEntity } from "./LinkedList";

export class LinkedListItemWithGroup extends BasicEntity {
  private _prev?: LinkedListItemWithGroup | ListItemGroup;
  private _next?: LinkedListItemWithGroup | ListItemGroup;

  public group?: ListItemGroup;

  constructor(id: string | number) {
    let newId = id;
    if (typeof newId !== "string") {
      newId = LinkedListItemWithGroup.createId(id);
    }
    super(newId);
  }

  public static createId(id: string | number): string {
    return `LinkedListItemWithGroup_${id}`;
  }

  get prev(): LinkedListItemWithGroup | undefined {
    if (this.group) {
      return this.group.prev;
    }
    return this._prev;
  }
  set prev(element: LinkedListItemWithGroup | undefined) {
    if (this.group) {
      this.group.prev = element;
    }
    this._prev = element;
  }

  get next(): LinkedListItemWithGroup | undefined {
    if (this.group) {
      return this.group.next;
    }
    return this._next;
  }
  set next(element: LinkedListItemWithGroup | undefined) {
    if (this.group) {
      this.group.next = element;
    }
    this._next = element;
  }

  toString(): string {
    return `${this.id}`;
  }
}

export class ListItemGroup extends LinkedListItemWithGroup {
  public items: LinkedListItemWithGroup[] = [];

  constructor(id: string | number) {
    let newId = id;
    if (typeof newId !== "string") {
      newId = ListItemGroup.createId(id);
    }
    super(newId);
  }

  public static createId(id: string | number): string {
    return `ListItemGroup_${id}`;
  }

  isGroupInList(): boolean {
    return Boolean(this.prev) || Boolean(this.next);
  }

  addItemToGroup(item: LinkedListItemWithGroup, list: LinkedListWithListItemGroup): ListItemGroup {
    const prev = item.prev;
    const next = item.next;
    const first = list.first;
    const last = list.last;
    const cuttedItem: LinkedListItemWithGroup = list.cutItem(item);

    if (this.items.includes(item)) {
      throw new Error("Error. Item is already in the group");
    }

    cuttedItem.group = this;
    this.items.push(cuttedItem);

    if (!this.isGroupInList()) {
      if (item === first || !prev) {
        list.addItemToTheBeginning(this);
      } else if (item === last || !next) {
        list.addItemToTheEnd(this);
      } else {
        list.addItemAfter(this, prev);
      }
    }

    return this;
  }

  toItemsString(): string {
    if (!this.items.length) {
      return "[]";
    }

    let itemsString = "";
    itemsString += "[";
    itemsString += this.items.map((item) => item.toString()).join(", ");
    itemsString += "]";

    return itemsString;
  }
}

export class LinkedListWithListItemGroup extends BasicEntity {
  first?: LinkedListItemWithGroup;
  last?: LinkedListItemWithGroup;

  constructor(id: string | number) {
    let newId = id;
    if (typeof newId !== "string") {
      newId = LinkedListWithListItemGroup.createId(id);
    }
    super(newId);
  }

  public static createId(id: string | number): string {
    return `LinkedListWithListItemGroup_${id}`;
  }

  addItemToTheBeginning(item: LinkedListItemWithGroup): LinkedListWithListItemGroup {
    this._addItem(item, "beginning");

    return this;
  }

  addItemToTheEnd(item: LinkedListItemWithGroup): LinkedListWithListItemGroup {
    this._addItem(item, "ending");

    return this;
  }

  addItemAfter(item: LinkedListItemWithGroup, originalItem: LinkedListItemWithGroup): LinkedListWithListItemGroup {
    this._addItem(item, "after-item", originalItem);

    return this;
  }

  /**
   * Cut an item from the list.
   * Relink item.prev and item.next to themself.
   * Set attibutes item.prev and item.next to undefined.
   *
   * Example. One list item per line.
   * `list before`:
   * ```
   * _ <- 1 -> 2
   * 1 <- 2 -> 3
   * 2 <- 3 -> _
   * ```
   *
   * Do `list.cutItem(2);` returns item (`{prev: undefined, next: undefined, ...rest}`).
   *
   * `list after`:
   * ```
   * undefined <- 1 -> 3
   * 1 <- 3 -> undefined
   * ```
   *
   * @param item LinkedListItemWithGroup
   */
  cutItem(item: LinkedListItemWithGroup): LinkedListItemWithGroup {
    if (!item) {
      throw new Error("Error. Parameter item is not defined");
    }

    const isFirst = item === this.first;
    const isLast = item === this.last;
    const prev = item.prev as LinkedListItemWithGroup;
    const next = item.next as LinkedListItemWithGroup;

    this._unlinkItem(item);
    this._linkItems(prev, next);

    if (isFirst) {
      this.first = next;
    }

    if (isLast) {
      this.last = prev;
    }

    return item;
  }

  toString() {
    const itemsRelations: string[] = [];
    let item = this.first;
    const visitedItemIds: string[] = [];
    while (item) {
      itemsRelations.push(`${item.prev ? item.prev.id : "_"} < ${item.id} > ${item.next ? item.next.id : "_"}`);

      if (item.next === item) {
        throw new Error("Error. Item can not be linked with itself throw .next attribute");
      }

      if (visitedItemIds.includes(item.id)) {
        throw new Error(
          "Error. Loop detected. Item was already visited during traversing. Item has two or more links lead to it or the list has a loop",
        );
      }

      visitedItemIds.push(item.id);
      item = item.next as LinkedListItemWithGroup | undefined;
    }

    return itemsRelations.join("\n");
  }

  toIdsStringByAttributeNext(): string[] {
    const itemIds: string[] = [];
    let item = this.first;
    const visitedItemIds: string[] = [];
    while (item) {
      if (item instanceof ListItemGroup) {
        itemIds.push(`${item.id}:${item.toItemsString()}`);
      } else {
        itemIds.push(item.id);
      }

      if (item.next === item) {
        throw new Error("Error. Item can not be linked with itself throw .next attribute");
      }

      if (visitedItemIds.includes(item.id)) {
        throw new Error(
          "Error. Loop detected. Item was already visited during traversing. Item has two or more links lead to it or the list has a loop",
        );
      }

      visitedItemIds.push(item.id);
      item = item.next as LinkedListItemWithGroup | undefined;
    }

    return itemIds;
  }

  toIdsStringByAttributePrev(): string[] {
    const itemIds: string[] = [];
    let item = this.last;
    const visitedItemIds: string[] = [];
    while (item) {
      if (item instanceof ListItemGroup) {
        itemIds.push(`${item.id}:${item.toItemsString()}`);
      } else {
        itemIds.push(item.id);
      }

      if (item.prev === item) {
        throw new Error("Error. Item can not be linked with itself throw .prev attribute");
      }

      if (visitedItemIds.includes(item.id)) {
        throw new Error(
          "Error. Loop detected. Item was already visited during traversing. Item has two or more links lead to it or the list has a loop",
        );
      }

      visitedItemIds.push(item.id);
      item = item.prev as LinkedListItemWithGroup | undefined;
    }

    return itemIds;
  }

  private _addItem(
    item: LinkedListItemWithGroup,
    position?: LinkedListPositionOnTheEndsOfList,
  ): LinkedListWithListItemGroup;
  private _addItem(
    item: LinkedListItemWithGroup,
    position: LinkedListPositionAfterItem,
    prevItem: LinkedListItemWithGroup,
  ): LinkedListWithListItemGroup;
  private _addItem(
    item: LinkedListItemWithGroup,
    position: LinkedListPosition = "ending",
    originalItem?: LinkedListItemWithGroup,
  ): LinkedListWithListItemGroup {
    if (!item) {
      throw new Error("Error. Parameter item is not defined");
    }

    if (!position) {
      throw new Error("Error. Parameter position is not defined");
    }

    this._unlinkItem(item);

    if (position === "beginning") {
      this._addItemToTheBeginning(item);
    } else if (position === "ending") {
      this._addItemToTheEnd(item);
    } else if (position === "after-item") {
      if (!originalItem) {
        throw new Error("Error. Parameter originalItem is not defined");
      }
      this._addItemAfter(item, originalItem);
    } else {
      throw new Error("Error. Unknown position");
    }

    return this;
  }

  private _addItemToTheBeginning(item: LinkedListItemWithGroup): void {
    const oldFirst = this.first;
    item.next = oldFirst;
    if (oldFirst) {
      oldFirst.prev = item;
    }
    this.first = item;
  }

  private _addItemToTheEnd(item: LinkedListItemWithGroup): void {
    const oldLast = this.last;
    item.prev = oldLast;
    if (oldLast) {
      oldLast.next = item;
    } else {
      this.first = item;
    }
    this.last = item;
  }

  private _addItemAfter(item: LinkedListItemWithGroup, originalItem: LinkedListItemWithGroup): void {
    if (!originalItem) {
      throw new Error("Error. Parameter originalItem is not defined");
    }
    item.prev = originalItem;
    item.next = originalItem.next;
    const originalNextItem = originalItem.next;
    if (originalNextItem) {
      originalNextItem.prev = item;
    } else {
      this.last = item;
    }
    originalItem.next = item;
  }

  private _linkItems(
    prevItem?: LinkedListItemWithGroup,
    nextItem?: LinkedListItemWithGroup,
  ): LinkedListWithListItemGroup {
    if (prevItem) {
      prevItem.next = nextItem;
    }

    if (nextItem) {
      nextItem.prev = prevItem;
    }

    return this;
  }

  private _unlinkItem(item: LinkedListItemWithGroup): LinkedListItemWithGroup {
    if (!item) {
      throw new Error("Error. Parameter item is not defined");
    }

    item.prev = undefined;
    item.next = undefined;
    item.group = undefined;

    return item;
  }
}
