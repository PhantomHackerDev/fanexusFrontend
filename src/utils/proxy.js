export const modelProxy = (context, attribute) =>
  new Proxy(context[attribute], {
    set(target, name, value) {
      if (name !== 'length') {
        if (Array.isArray(context[attribute])) {
          const copy = [...context[attribute]];
          copy[name] = value;
          context.$emit('input', copy);
        } else {
          context.$emit('input', {
            ...context[attribute],
            [name]: value
          });
        }
      }
      return true;
    }
  });
