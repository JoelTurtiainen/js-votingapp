export function localStorageHas(key, item) {
  if (localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key)).includes(item);
  }
  return false;
}

export function addNewUser(formData) {
  const { username, email } = formData;
  pushToLocalStorage('usernames', username);
  pushToLocalStorage('emails', email);
  const userData = { sensitive: formData, voteData: {} };

  localStorage.setItem(username, JSON.stringify(userData));
}

export function pushToLocalStorage(key, value) {
  const storageItem = getParsedFromStorage(key) || [];
  storageItem.push(value);
  localStorage.setItem(key, JSON.stringify(storageItem));
}

export function assignToLocalStorage(localStorageKey, keyToAssign, valueToAssign) {
  const storageItem = getParsedFromStorage(localStorageKey) || {};
  storageItem[keyToAssign] = valueToAssign;
  localStorage.setItem(localStorageKey, JSON.stringify(storageItem));
  console.log(storageItem);
}

export function getParsedFromStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
