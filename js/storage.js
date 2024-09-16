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
  console.log(`Local Storage '${localStorageKey}' object is now:`, storageItem);
}

export function getParsedFromStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function removePollFromStorage(pollID) {
  const polls = getParsedFromStorage('polls');
  delete polls[pollID];
  localStorage.setItem('polls', JSON.stringify(polls));
}

export function getCurrentUserVote(id) {
  const currentUser = localStorage.getItem('currentUser');
  const votes = getParsedFromStorage(currentUser).voteData;
  if (votes[id]) {
    return votes[id];
  } else {
    return -1;
  }
}

export function updateUserVotes(id, option) {
  const curUserName = localStorage.getItem('currentUser');
  const curUserData = getParsedFromStorage(curUserName);
  curUserData.voteData[id] = option;
  localStorage.setItem(curUserName, JSON.stringify(curUserData));
}

export function updatePollStorageObject(id, option, prevoption = -1) {
  const pollStorageObj = getParsedFromStorage('polls')[id];
  // Take a vote away from previous option if any
  if (prevoption < 0) {
    pollStorageObj.total++;
  } else {
    pollStorageObj.options[prevoption].value--;
  }

  // Add a vote to selected
  // console.log(pollStorageObj.options);
  pollStorageObj.options[option].value++;

  assignToLocalStorage('polls', id, pollStorageObj);
}
