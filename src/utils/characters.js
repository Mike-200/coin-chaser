const cache = {};

function cacheResources(resources) {
  resources.keys().forEach((key) => (cache[key] = resources(key)));
}

cacheResources(require.context('../assets/characters', false, /.*/));

export default cache;

export function getAvatar(id, characters) {
  return characters[Object.keys(characters)[id]].default;
}