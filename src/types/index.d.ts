interface Item {
  name: string;
  price: number;
}

type Items = Item[];

declare global {
  var items: Items;
}

export { global, Item, Items };
