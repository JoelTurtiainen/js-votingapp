/**

 * @param {Object} option
 * @param {number} total
 * @param {Object} element
 */

import { getParsedFromStorage, getCurrentUserVote, updatePollStorageObject, updateUserVotes } from './storage.js';

//## PROGRESS BAR

export function createProgressBar(option, total) {
  const width = (option.value / total) * 100 || 0;

  const progress = createElement('div', {
    className: 'progress fs-6',
    role: 'progressbar',
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

// function createVoteCard({ options, total, title }) {
//   const card = createCard(title);
//   const cardBody = card.lastElementChild;
//   const totalText = createElement('p', {}, `Total Votes: ${total}`);

//   options.forEach((option, n) => {
//     const label = createLabel(option, total, n);
//     cardBody.appendChild(label);
//   });

//   cardBody.appendChild(totalText);

//   return card;
// }

export function voteCardToDOM(data) {
  const selected = getCurrentUserVote(data.id);

  const poll = new PollCard(data, selected);
  const form = poll.form;

  const destination = document.getElementById('all-votes');

  destination.appendChild(form);
  return poll;
}

/**
 * @param {number} selected
 */
class PollCard {
  constructor(data, selected) {
    this.id = data.id;
    this.selected = selected || -1;
    this.options = data.options;
    this.total = data.total;
    this.title = data.title;
    this.form = this.createPollForm();
    this.listener = this.onVote.bind(this);
    this.form.addEventListener('change', this.listener, { passive: true });
  }

  createPollForm() {
    const card = createCard(this.title);
    const cardBody = card.lastElementChild;
    const totalText = createElement('p', {}, `Total Votes: ${this.total}`);
    const form = createElement('form', { className: 'vote col', id: this.id });

    this.options.forEach((option, n) => {
      const label = createLabel(option, this.total, n);
      cardBody.appendChild(label);
    });

    if (this.selected >= 0) cardBody.children[this.selected].firstElementChild.checked = true;

    cardBody.appendChild(totalText);
    form.appendChild(card);

    return form;
  }

  refreshData() {
    const poll = getParsedFromStorage('polls')[this.id];
    if (poll) {
      this.total = poll.total;
      this.options = poll.options;
      // console.debug(this.total, this.options);
    } else {
      console.error(`Poll with id ${this.id} not found in storage.`);
    }
  }

  onVote(event) {
    // if bugs happen is probably here
    // console.log('onVote event triggered');
    const prevOption = this.selected;
    this.selected = event.target.value;
    this.form.dataset.selected = this.selected;
    console.debug(`Poll '${this.id}' option selected: ${this.selected}`);
    updateUserVotes(this.id, this.selected);
    updatePollStorageObject(this.id, this.selected, prevOption);
    this.refreshData();
    recalculateBars(this.id, this.total, this.options);
  }

  // removeListener() {
  //   // not working
  //   console.log(this.form);
  //   this.form.removeEventListener('change', this.listener);
  // }
}

function recalculateBars(id, total, options) {
  const poll = document.getElementById(id);
  const progressBars = poll.querySelectorAll('.progress-bar');
  const totalVotesDisplay = poll.querySelector('.card-body > p');
  totalVotesDisplay.textContent = `Total Votes: ${total}`;

  for (let index = 0; index < options.length; index++) {
    const option = options[index];
    const element = progressBars[index];
    const width = (option.value / total) * 100 || 0;

    element.style.width = `${width}%`;
  }
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
    // console.log(input);
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

/**
 * @param {string} tag - The type of element to create (e.g., 'div', 'span').
 * @param {Object} [attributes={}] - An object containing key-value pairs to set as attributes on the element.
 * @param {string} [textContent=''] - The text content to set for the element.
 * @returns {HTMLElement} The newly created DOM element.
 */

export function createElement(tag, attributes = {}, textContent = '') {
  const element = document.createElement(tag);
  Object.assign(element, attributes);
  if (textContent) {
    element.textContent = textContent;
  }

  return element;
}

export function setAttributes(element, attributes) {
  Object.entries(attributes).forEach(([attr, value]) => element.setAttribute(attr, value));
  return;
}

export function getFormData(form) {
  return Object.fromEntries(new FormData(form));
}
