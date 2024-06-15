export default {
  addRel(ref) {
    for (const anchor of ref.getElementsByTagName('a')) {
      anchor.rel = 'ugc';
    }
  }
};
