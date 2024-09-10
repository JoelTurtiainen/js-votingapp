/**
 *
 * @param {Object} option
 * @param {number} total
 * @returns {Element} Should return element :)
 */

import { assignToLocalStorage, getParsedFromStorage } from './storage.js';

//## PROGRESS BAR

export function createProgressBar(option, total) {
  const width = (option.value / total) * 100 || 0;

  const progress = createElement('div', {
    'className': 'progress fs-6',
    'role': 'progressbar',
    'aria-valuenow': option.value,
    'aria-valuemin': 0,
    'aria-valuemax': 100,
  });

  // const progressText = createElement('p', { className: 'progress-text' }, option.name);
  const progressBar = createElement('div', {
    className: 'progress-bar overflow-visible text-start',
    style: `width: ${width}%`,
  });

  // Ughhh.. have to put the text in a span, for text offset
  const optionName = createElement('span', { className: 'px-2' }, option.name);

  progressBar.appendChild(optionName);
  progress.appendChild(progressBar);

  return progress;
}

//## CARD

// might not be valid HTML but makes progressBar work as radio button
function createLabel(option, total, n) {
  const label = createElement('label', { className: 'progress-label' });
  const input = createElement('input', { type: 'radio', name: `option`, value: n });

  const progressBar = createProgressBar(option, total);

  label.appendChild(input);
  label.appendChild(progressBar);

  return label;
}

export function createCard(title) {
  const card = createElement('div', { classList: 'card' });
  const cardTitle = createElement('div', { classList: 'card-title mt-2 fs-4' }, title);
  const cardBody = createElement('div', { className: 'card-body' });

  card.appendChild(cardTitle);
  card.appendChild(cardBody);

  return card;
}

function createVoteCard({ options, total, title }) {
  const card = createCard(title);
  const cardBody = card.lastElementChild;
  const totalText = createElement('p', {}, `Total Votes: ${total}`);

  options.forEach((option, n) => {
    const label = createLabel(option, total, n);
    cardBody.appendChild(label);
  });

  cardBody.appendChild(totalText);

  return card;
}

export function voteCardToDOM(data) {
  const form = createElement('form', { className: 'vote col', id: data.id });
  const voteCard = createVoteCard(data);
  const destination = document.getElementById('all-votes');

  form.appendChild(voteCard);
  destination.appendChild(form);

  form.addEventListener('change', onChange);
}

function onChange(event) {
  event.preventDefault();
  const formData = getFormData(this);
  const curUserName = localStorage.getItem('currentUser');
  const curUserData = getParsedFromStorage(curUserName);

  const prevOption = curUserData.voteData[this.id] || undefined;
  updatePollValues(this.id, formData.option, prevOption);

  console.debug(`Poll '${this.id}' option selected: ${formData.option}`);

  curUserData.voteData[this.id] = formData.option;
  localStorage.setItem(curUserName, JSON.stringify(curUserData));
  recalculateBars(this);
}

function updatePollValues(pollId, option, prevoption = undefined) {
  const pollStorageObj = getParsedFromStorage('polls')[pollId];

  // Take a vote away from previous option if any
  if (prevoption === undefined) {
    pollStorageObj.total++;
  } else {
    pollStorageObj.options[prevoption].value--;
  }

  // Add a vote to selected
  pollStorageObj.options[option].value++;

  assignToLocalStorage('polls', pollId, pollStorageObj);
}

function recalculateBars(poll) {
  poll;
  console.log(poll);
}

//## LOGIN / REGISTER

function createInput(data) {
  const div = createElement('div', { className: 'pb-3' });
  const input = createElement('input', data);

  div.appendChild(input);

  if (data.feedback) {
    const divFeedback = createElement('div', { className: 'invalid-feedback' }, data.feedback);
    div.appendChild(divFeedback);
  }

  return div;
}

export function createAuthCard(data) {
  const card = createCard(data.title);
  card.style = 'width: 30rem';
  card.classList.add('text-center', 'p-5', 'm-auto');
  const cardBody = card.lastElementChild;
  const btnDiv = createElement('div', { className: 'd-flex justify-content-evenly' });

  // Input fields
  data.fields.forEach((field) => {
    const input = createInput(field);
    console.log(input);
    cardBody.appendChild(input);
  });

  // Create buttons for card
  data.buttons.forEach((item) => {
    const button = createElement('button', item);
    btnDiv.appendChild(button);
  });

  // Container for cards
  cardBody.appendChild(btnDiv);

  return card;
}

//## COMMON

export function createElement(tag, attributes = {}, textContent = '') {
  const element = document.createElement(tag);
  Object.assign(element, attributes);
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
}

export function getFormData(form) {
  return Object.fromEntries(new FormData(form));
}
