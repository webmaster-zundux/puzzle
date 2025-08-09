// this is template
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null),
      );
    });
  });
}

// example
// // Each mixin is a traditional ES class
// class Jumpable {
//   jump() {}
// }

// class Dashable {
//   dash() {}
// }

// // Including the base
// class Dot {
//   x = 0;
//   y = 0;
// }

// // Then you create an interface which merges
// // the expected mixins with the same name as your base
// interface Dot extends Jumpable, Dashable {}

// // Apply the mixins into the base class via
// // the JS at runtime
// applyMixins(Dot, [Jumpable, Dashable]);

// let player = new Dot();
// player.jump();
// console.log(player.x, player.y);
