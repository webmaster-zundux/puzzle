export class BasicEntity {
  constructor(public id: string) {}
}

export type LinkedListPositionBeginnin = "beginning";
export type LinkedListPositionEnding = "ending";
export type LinkedListPositionAfterItem = "after-item";

export type LinkedListPositionOnTheEndsOfList = LinkedListPositionBeginnin | LinkedListPositionEnding;

export type LinkedListPosition = LinkedListPositionBeginnin | LinkedListPositionEnding | LinkedListPositionAfterItem;

export class LinkedList<ListItem extends LinkedListItem = LinkedListItem> {
  first?: ListItem;
  last?: ListItem;

  addItem(item: ListItem, position?: LinkedListPositionOnTheEndsOfList): LinkedList;
  addItem(item: ListItem, position: LinkedListPositionAfterItem, prevItem: ListItem): LinkedList;
  addItem(item: ListItem, position: LinkedListPosition = "ending", originalItem?: ListItem) {
    if (!item) {
      throw new Error("item is not defined");
    }

    if (!position) {
      throw new Error("position is not defined");
    }

    this._unlinkItem(item);

    if (position === "beginning") {
      const oldFirst = this.first;
      item.next = oldFirst;
      if (oldFirst) {
        oldFirst.prev = item;
      }
      this.first = item;
    } else if (position === "ending") {
      const oldLast = this.last;
      item.prev = oldLast;
      if (oldLast) {
        oldLast.next = item;
      } else {
        this.first = item;
      }
      this.last = item;
    } else if (position === "after-item") {
      if (!originalItem) {
        throw new Error("originalItem is not defined");
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
    } else {
      throw new Error("Unknown LinkedListPosition");
    }

    return this;
  }

  cutItem(item: ListItem): ListItem {
    if (!item) {
      throw new Error("item is not defined");
    }

    const isFirst = item === this.first;
    const isLast = item === this.last;
    const prev = item.prev as ListItem;
    const next = item.next as ListItem;
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

      item = item.next as ListItem | undefined;
    }

    return itemsRelations.join("\n");
  }

  toIdsStringByAttributeNext(): string[] {
    const itemIds: string[] = [];
    let item = this.first;
    const visitedItemIds: string[] = [];
    while (item) {
      itemIds.push(item.id);

      if (item.next === item) {
        throw new Error("Error. Item can not be linked with itself throw .next attribute");
      }

      if (visitedItemIds.includes(item.id)) {
        throw new Error(
          "Error. Loop detected. Item was already visited during traversing. Item has two or more links lead to it or the list has a loop",
        );
      }

      item = item.next as ListItem | undefined;
    }

    return itemIds;
  }

  toIdsStringByAttributePrev(): string[] {
    const itemIds: string[] = [];
    let item = this.last;
    const visitedItemIds: string[] = [];
    while (item) {
      itemIds.push(item.id);

      if (item.prev === item) {
        throw new Error("Error. Item can not be linked with itself throw .next attribute");
      }

      if (visitedItemIds.includes(item.id)) {
        throw new Error(
          "Error. Loop detected. Item was already visited during traversing. Item has two or more links lead to it or the list has a loop",
        );
      }

      item = item.prev as ListItem | undefined;
    }

    return itemIds;
  }

  private _linkItems(prevItem?: ListItem, nextItem?: ListItem): LinkedList {
    if (prevItem) {
      prevItem.next = nextItem;
    }

    if (nextItem) {
      nextItem.prev = prevItem;
    }

    return this;
  }

  private _unlinkItem(item: ListItem): ListItem {
    if (!item) {
      throw new Error("item is not defined");
    }

    item.prev = undefined;
    item.next = undefined;

    return item;
  }
}

export class LinkedListItem extends BasicEntity {
  private _prev?: LinkedListItem;
  private _next?: LinkedListItem;

  constructor(id: string | number) {
    let newId = id;
    if (typeof newId !== "string") {
      newId = LinkedListItem.createId(id);
    }
    super(newId);
  }

  public static createId(id: string | number): string {
    return `LinkedListItem_${id}`;
  }

  get prev(): LinkedListItem | undefined {
    return this._prev;
  }
  set prev(element: LinkedListItem | undefined) {
    this._prev = element;
  }

  get next(): LinkedListItem | undefined {
    return this._next;
  }
  set next(element: LinkedListItem | undefined) {
    this._next = element;
  }
}
