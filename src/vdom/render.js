const createDomNode = (tagName) => document.createElement(tagName);

const addPropsToNode = (props, $node) => Object.keys(props).reduce(
  ($el, prop) => {
    $el.setAttribute(prop, props[prop]);

    return $el;
  },
  $node,
);

const addChildrenToNode = (children, $node) => children.reduce(
  ($domNode, child) => {
    $domNode.appendChild(render(child));

    return $domNode;
  },
  $node,
);

const renderElement = ({ tagName, props, children }) => {
  const $node = createDomNode(tagName);
  const $nodeWithProps = addPropsToNode(props, $node);
  const $nodeWithPropsAndChildren = addChildrenToNode(children, $nodeWithProps);

  return $nodeWithPropsAndChildren;
};

const render = (vNode) => {
  let $node;

  typeof vNode === 'string'
    ? $node = document.createTextNode(vNode)
    : $node = renderElement(vNode);

  return $node;
};

export default render;
