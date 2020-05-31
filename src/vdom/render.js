import { pipe, partial } from '../utils';

const createNode = (tagName) =>
  document.createElement(tagName)

const setAttribute = (props, $el, prop) => {
  $el.setAttribute(prop, props[prop])

  return $el
}

const addPropsToNode = (props, $node) =>
  Object.keys(props).reduce(partial(setAttribute, props), $node)

const appendChild = ($domNode, child) => {
  $domNode.appendChild(render(child))

  return $domNode
}

const appendChildrenToNode = (children, $node) =>
  children.reduce(appendChild, $node)

const renderElement = ({ tagName, props, children }) =>
  pipe(
    createNode,
    partial(addPropsToNode, props),
    partial(appendChildrenToNode, children)
  )(tagName)

const render = (vNode) =>
  typeof vNode === 'string'
    ? document.createTextNode(vNode)
    : renderElement(vNode)

export default render
