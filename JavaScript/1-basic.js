'use strict';

// Composite is a design pattern to create part-whole hierarchies of entities
// so that the parts and composites can be treated uniformly and transparently
// by the client.
// Main components of the Composite pattern are a 'component' interface which
// declares common operations, 'composite' which represents a container and
// typically delegates all operations to its children and a 'leaf' that
// represents the end of the hierarchy, implements operations and usually
// contains no children.
// The example here represents View hierarchy using the Composite pattern to
// uniformly treat all components.

class ViewComponent {

  draw() {
    throw new Error('Not implemented');
  }

  // Another option would be to have the add/remove/iterate methods be in the
  // component itself (here) this allows for more transparency (no difference
  // between 'leaf' and 'composite' for the client but may lead to errors, like
  // adding a child to a leaf node that doesn't support it).
  //
  // One more option would be to declare an `getComposite()` method here with
  // default implementation to allow checks for whether object is a composite
  // or a leaf. However this would break the transparency/uniformity of the
  // hierarchy.
}

class ViewComposite extends ViewComponent {

  // This composite represents children as an Array which is not a requirement.
  // They may be contained in an arbitrary stucture with or without the defined
  // order depending on the application and requirements.
  #children = [];

  add(child) {
    // May be checked if the `child` is already present in this composite.
    // May be checked if the `child` is already present in the other composite
    // to disallow sharing of children. This may require children to also
    // contain 'parent' references or at least isChild status.
    this.#children.push(child);
  }

  remove(child) {
    this.#children.remove(child);
  }

  draw() {
    // Simply delegate the operation to the children.
    this.#children.forEach(child => child.draw());
  }

  // Can also be present if it is possible and needed to get a specific child.
  // This way every child should have a unique Id and Map can be used to store
  // the children.
  // get(id) {}

  [Symbol.iterator]() {
    return this.#children[Symbol.iterator]();
  }
}

class DecoratorComposite extends ViewComposite {
  draw() {
    // Not only delegate the operation but also augment the behavior.
    console.log('NestedStart');
    super.draw();
    console.log('NestedEnd');
  }
}

class PrintLeaf extends ViewComponent {
  constructor(text) {
    super();
    this.text = text;
  }

  draw() {
    console.log(this.text);
  }
}

// Usage. As we can see all relevant methods are called transparently on
// Composites or Leaves

const hello = new PrintLeaf('hello');
const world = new PrintLeaf('world');
const js = new PrintLeaf('js');

const helloView = new ViewComposite();
helloView.add(hello);
helloView.add(world);

const jsView = new ViewComposite();
jsView.add(world);
jsView.add(js);

const nestedView = new DecoratorComposite();
nestedView.add(helloView);
nestedView.add(jsView);

console.group('Leaf component .draw()');
hello.draw();
console.groupEnd();  
console.log();

console.group('Composite component .draw()');
helloView.draw();
console.groupEnd();  
console.log();

console.group('Another Composite component .draw()');
jsView.draw();
console.groupEnd();  
console.log();

console.group('Composite of composites component .draw()');
nestedView.draw();
console.groupEnd();  
console.log();

console.group('Composite of composites component iterate children');
for (const child of nestedView) {
  child.draw();
}
console.groupEnd();  
console.log();
