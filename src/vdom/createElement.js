export default (tagName, props = {}, ...children) => 
  Object.assign(
    Object.create(null),
    { 
      tagName, 
      props, 
      children, 
    }
  );


  