const renderElement = ({ tagName, props, children }) => {
  const $element = document.createElement(tagName);

  const $elementWithProps = Object.keys(props).reduce(
    ($el, prop) => {
      $el.setAttribute(prop, props[prop]);

      return $el;
    },
    $element,
  );

  const $elementWithChildren = children.reduce(
    ($el, child) => {
      $el.appendChild(render(child));

      return $el;
    },
    $elementWithProps,
  );

  return $elementWithChildren;
};

const render = (vNode) => {
  let $node;

  typeof vNode === 'string'
    ? $node = document.createTextNode(vNode)
    : $node = renderElement(vNode);

  return $node;
};

export default render;
