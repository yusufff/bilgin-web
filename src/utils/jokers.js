const KEY = 'jokers';
export const JOKERS_BASE = {
  double: false,
  eliminate: false,
}

export const getLocalJokers = (id) => {
  const jokers = JSON.parse(window.localStorage.getItem(KEY)) || {};
  return jokers[id] || { ...JOKERS_BASE };
}

export const setLocalJokers = (id, joker, value) => {
  const jokers = JSON.parse(window.localStorage.getItem(KEY)) || {};
  const newJokers = {
    ...jokers,
    [id]: {
      ...(jokers[id] || JOKERS_BASE),
      [joker]: value
    }
  }
  window.localStorage.setItem(KEY, JSON.stringify(newJokers));
  return newJokers;
}