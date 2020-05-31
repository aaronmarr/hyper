import { pipe, partial } from '../utils';
import render from './render';

const setAttribute = (prop, propValue, $node) => {
  $node.setAttribute(prop, propValue);

  return $node;
}

const getSetters = (nextProps, setters, prop) => {
  setters.push(
    partial(setAttribute, prop, nextProps[prop]),
  );

  return setters;
}

const getPropSetters = (nextProps) =>
  Object.keys(nextProps).reduce(
    partial(getSetters, nextProps),
    [],
  );

const unsetAttribute = (prop, $node) => {
  $node.removeAttribute(prop);

  return $node;
};

const getUnsetters = (nextProps, patches, prop) => {
  if (!prop in nextProps) {
    patches.push(
      partial(unsetAttribute, prop)
    );
  }

  return patches;
}

const getPropUnsetters = (nextProps, prevProps) => 
  Object.keys(prevProps).reduce(
    partial(getUnsetters, nextProps),
    [],
  );

const patchProps = (patches, $node) =>
  patches.reduce(($node, patch) => {
    const $patched = patch($node);

    return $patched;
  },
  $node);

const diffProps = (prevProps, nextProps) => {
  const patches = [
    ...getPropSetters(nextProps),
    ...getPropUnsetters(nextProps, prevProps),
  ];

  return partial(patchProps, patches);
};

const getPatches = (newChildren, patches, oldChild, i) => {
  patches.push(diff(oldChild, newChildren[i]));

  return patches;
}

const getChildPatches = (oldChildren, newChildren) =>
  oldChildren.reduce(
    partial(getPatches, newChildren),
    [],
  );

const zip = (childPatches, childNodes) =>
  childPatches.reduce((zipped, patch, index) => {
    zipped.push([patch, childNodes[index]]);

    return zipped;
  }, []);

const updateDom = (childPatches, additionalPatches, $parent) => {
  const patches = zip(childPatches, $parent.childNodes);

  patches.map(([patch, $child]) => patch($child));
  additionalPatches.map(patch => patch($parent));

  return $parent;
}

const appendChild = (newChild, $node) => {
  $node.appendChild(render(newChild));

  return $node;
}

const getAddition = (patches, newChild) => {
  patches.push(partial(appendChild, newChild));

  return patches;
}

const getAdditionPatches = (oldVChildren, newVChildren) =>
  newVChildren.slice(oldVChildren.length).reduce(
    partial(getAddition),
    [],
  );

const diffChildren = (oldVChildren, newVChildren) => {
  const childPatches = getChildPatches(
    oldVChildren,
    newVChildren
  );

  const additionPatches = getAdditionPatches(
    oldVChildren,
    newVChildren,
  );

  return partial(updateDom, childPatches, additionPatches);
};

const removeNode = ($node) => {
  $node.remove();

  return undefined;
}

const replaceNode = (newVTree, $node) => {
  const $newNode = render(newVTree);

  $node.replaceWith($newNode);

  return $newNode;
}

const passThrough = ($node) => $node;

const patchNode = (oldVTree, newVTree, $node) => {
  const patchProps = diffProps(
    oldVTree.props,
    newVTree.props,
  );

  const patchChildren = diffChildren(
    oldVTree.children,
    newVTree.children,
  );

  return pipe(patchProps, patchChildren)($node);
}

const diff = (oldVTree, newVTree) => {
  let patch;

  if (
    !patch
    && typeof newVTree === 'undefined'
  ) {
    patch = removeNode;
  }

  if (
    !patch
    && (
      typeof oldVTree === 'string'
      || typeof newVTree === 'string'
    )
  ) {
    if (oldVTree !== newVTree) {
      patch = partial(replaceNode, newVTree);
    } else {
      patch = passThrough;
    }
  }

  if (
    !patch
    && oldVTree.tagName !== newVTree.tagName
  ) {
    patch = partial(replaceNode, newVTree);
  }

  if (!patch) {
    patch = partial(patchNode, oldVTree, newVTree);
  }

  return patch;
};

export default diff;

