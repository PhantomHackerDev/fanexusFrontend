const getComponentsByPrefix = function(prefix) {
  const componentsArray = Object.values(this.$options.components).filter(
    c => c.name && c.name.startsWith(prefix)
  );

  return componentsArray.map(c => c.name);
};

export default getComponentsByPrefix;
