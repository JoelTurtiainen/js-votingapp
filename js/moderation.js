import { createElement, createProgressBar, getFormData, setAttributes, voteCardToDOM } from './dom.js';
import { assignToLocalStorage } from './storage.js';
import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js';

export const pollModal = {
  modal: document.getElementById('pollAddingModal'),
  body: document.querySelector('.modal-body'),
  footer: document.querySelector('.modal-footer'),
  inputTitle: document.getElementById('fieldPollTitle'),
  inputOption: document.getElementById('fieldPollOpt'),
  previewTitle: document.getElementById('previewTitle'),
  bsModal: new bootstrap.Modal('#pollAddingModal'),
  instance: bootstrap.Modal.getInstance('#pollAddingModal'),

  load() {
    this.onClick = this.onClick.bind(this);
    this.modal.addEventListener('click', this.onClick);

    this.onInput = this.onInput.bind(this);
    this.modal.addEventListener('input', this.onInput);
  },

  onInput(e) {
    if (e.target.id === 'fieldPollTitle') {
      this.previewTitle.textContent = e.target.value;
      e.target.classList.remove('is-invalid');
    } else if (e.target.id === 'fieldPollOpt') {
      e.target.classList.remove('is-invalid');
    }
  },

  onClick(e) {
    const formData = getFormData(this.modal);
    console.debug(e.target);

    if (e.target.classList.contains('remove-item')) {
      console.log('removing...');
      e.target.parentElement.remove();
      return;
    }

    switch (e.target.id) {
      case 'btnAddOption':
        const name = formData.fieldPollOpt;

        if (!name) {
          this.inputOption.classList.add('is-invalid');
          break;
        }

        // Randomize the progressbar preview value
        const value = Math.floor(Math.random() * 10) + 1;
        const rmBtn = createElement('button', { classList: 'btn remove-item bi bi-trash', type: 'button' });
        const progBar = createProgressBar({ value, name }, 10);

        progBar.classList.add('fs-6', 'position-relative', 'd-flex', 'justify-content-between');
        progBar.dataset.name = name;
        progBar.appendChild(rmBtn);

        this.body.appendChild(progBar);
        this.inputOption.value = '';
        break;

      case 'btnSubmitPoll':
        const progressBars = document.querySelectorAll('.modal-body > .progress');

        if (formData.fieldPollTitle.length > 4) {
          console.log('title should be ok');
        } else {
          this.inputTitle.classList.add('is-invalid');
        }

        if (progressBars.length >= 2) {
          console.log('submitting poll');

          const pollData = pollToData(formData.fieldPollTitle, progressBars);
          const id = nanoid(10);
          assignToLocalStorage('polls', id, pollData);
          voteCardToDOM(pollData);

          // Dismiss modal
          this.instance.hide();
        }

        break;
      default:
        return;
    }
  },
};

function pollToData(title, progressBars) {
  const total = 0;
  const options = [];

  progressBars.forEach((element) => {
    const name = element.dataset.name;
    options.push({ name, value: 0 });
  });

  return { title, total, options };
}

// pollModal.load();

// ## EDIT MODE

const editMode = {
  active: false,

  load() {
    this.active = true;
    const cards = document.querySelectorAll('form.vote > .card');

    cards.forEach((card) => {
      const footer = this.createFooter();
      card.appendChild(footer);
      footer.addEventListener('click', this.onClick);
    });
  },
  unload() {
    this.active = false;
    const cards = document.querySelectorAll('form.vote > .card');

    cards.forEach((card) => {
      const lastElement = card.lastElementChild;
      if (lastElement.classList.contains('card-footer')) {
        lastElement.removeEventListener('click', this.onClick);
        lastElement.remove();
      }
    });
  },
  createFooter() {
    const footer = createElement('div', { className: 'card-footer' });
    const removeBtn = createElement('button', { classList: 'btn remove-item bi bi-trash', type: 'button' });
    footer.appendChild(removeBtn);
    return footer;
  },

  onClick(e) {
    const classes = [...e.target.classList];
    if (classes.includes('remove-item')) {
      const parentForm = e.target.closest('form');
      console.log(parentForm.id);
      // TODO: remove old event listeners

      parentForm.remove();

      // TODO: uncomment this on release
      //removePollFromStorage(parentForm.id);
    }
  },
};

export function createModerationNav() {
  const navItem = createElement('li', { classList: 'nav-item dropstart' });
  const toggleBtn = createElement('a', { classList: 'nav-link dropdown-toggle', href: '#', role: 'button', ariaExpanded: 'false' }, 'Moderation');
  toggleBtn.setAttribute('data-bs-toggle', 'dropdown');

  const dropdownMenu = createElement('ul', { classList: 'dropdown-menu' });

  const addPoll = createElement('li');
  const a1 = createElement('a', { classList: 'dropdown-item' }, 'Create a poll');
  setAttributes(a1, { 'data-bs-toggle': 'modal', 'data-bs-target': '#pollAddingModal' });
  addPoll.appendChild(a1);

  const removePoll = createElement('li');
  const a2 = createElement('a', { classList: 'dropdown-item', id: 'removePolls' }, 'Toggle Edit mode');
  a2.addEventListener('click', toggleEditMode);
  removePoll.appendChild(a2);

  dropdownMenu.appendChild(addPoll);
  dropdownMenu.appendChild(removePoll);
  navItem.appendChild(toggleBtn);
  navItem.appendChild(dropdownMenu);

  console.log(navItem);

  const destination = document.querySelector('#navbarNavDropdown .navbar-nav');
  destination.prepend(navItem);
}

// ## REAL
// const editModeBtn = document.getElementById('removePolls');
// editModeBtn.addEventListener('click', toggleEditMode);

function toggleEditMode() {
  if (!editMode.active) editMode.load();
  else editMode.unload();
}

//DEBUG:
//editMode.load();
