export function localStorageHas(key, item) {
  if (localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key)).includes(item);
  }
  return false;
}

export function addNewUser(formData) {
  const { username, email, password } = formData;
  pushToLocalStorage('usernames', username);
  pushToLocalStorage('emails', email);

  localStorage.setItem(username, JSON.stringify(formData));
}

export function pushToLocalStorage(key, value) {
  const taken = JSON.parse(localStorage.getItem(key)) || [];
  taken.push(value);
  localStorage.setItem(key, JSON.stringify(taken));
}
