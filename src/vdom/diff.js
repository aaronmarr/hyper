import { pipe, partial } from '../utils';
import render from './render';

// TODO fix thsi now! Move to util
const zip = (xs, ys) => {
  const zipped = [];

  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]]);
  }

  return zipped;
};

const setAttribute = (prop, propValue, $node) => {
  $node.setAttribute(prop, propValue);

  return $node;
}

const getPropSetters = (nextProps) => Object.keys(nextProps).reduce(
  (patches, prop) => {
    patches.push(partial(setAttribute, prop, nextProps[prop]));

    return patches;
  }, [],
);

const unsetAttribute = (prop, $node) => {
  $node.removeAttribute(prop);

  return $node;
};

const getPropUnsetters = (nextProps, prevProps) => 
  Object.keys(prevProps).reduce(
    (patches, prop) => {
      if (!prop in nextProps) {
        patches.push(partial(unsetAttribute, prop));
      }

      return patches;
    }, [],
  );

const diffProps = (prevProps, nextProps) => {
  const patches = [
    ...getPropSetters(nextProps),
    ...getPropUnsetters(nextProps, prevProps),
  ];

  return ($node) => patches.reduce(($node, patch) => {
    const $patched = patch($node);

    return $patched;
  }, $node);
};

const getChildPatches = (oldChildren, newChildren) => oldChildren.reduce(
  (patches, oldChild, i) => {
    patches.push(diff(oldChild, newChildren[i]));

    return patches;
  }, [],
);

const diffChildren = (oldVChildren, newVChildren) => {
  const childPatches = getChildPatches(oldVChildren, newVChildren);

  const additionalPatches = [];

  for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    additionalPatches.push($node => {
      $node.appendChild(render(additionalVChild));
      return $node;
    });
  }

  return $parent => {
    // since childPatches are expecting the $child, not $parent,
    // we cannot just loop through them and call patch($parent)
    for (const [patch, $child] of zip(childPatches, $parent.childNodes)) {
      patch($child);
    }

    for (const patch of additionalPatches) {
      patch($parent);
    }
    return $parent;
  };
};

const diff = (oldVTree, newVTree) => {
  // let's assume oldVTree is not undefined!
  if (newVTree === undefined) {
    return $node => {
      $node.remove();
      // the patch should return the new root node.
      // since there is none in this case,
      // we will just return undefined.
      return undefined;
    }
  }

  if (typeof oldVTree === 'string' ||
    typeof newVTree === 'string') {
    if (oldVTree !== newVTree) {
      // could be 2 cases:
      // 1. both trees are string and they have different values
      // 2. one of the trees is text node and
      //    the other one is elem node
      // Either case, we will just render(newVTree)!
      return $node => {
         const $newNode = render(newVTree);
         $node.replaceWith($newNode);
         return $newNode;
       };
    } else {
      // this means that both trees are string
      // and they have the same values
      return $node => $node;
    }
  }

  if (oldVTree.tagName !== newVTree.tagName) {
    // we assume that they are totally different and 
    // will not attempt to find the differences.
    // simply render the newVTree and mount it.
    return $node => {
      const $newNode = render(newVTree);
      $node.replaceWith($newNode);
      return $newNode;
    };
  }

  const patchProps = diffProps(oldVTree.props, newVTree.props);
  const patchChildren = diffChildren(oldVTree.children, newVTree.children);

  return $node => {
    patchProps($node);
    patchChildren($node);
    return $node;
  };
};

export default diff;
