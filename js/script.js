import { checkLogin, loginUser, validateRegisterForm } from './login.js';
import { addNewUser, assignToLocalStorage, getParsedFromStorage, pushToLocalStorage } from './storage.js';
import { dataRegister, dataLogin, debugVotePolls } from './data.js';
import { createAuthCard, createElement, createProgressBar, getFormData, loadPollsFromStorage, voteCardToDOM } from './dom.js';
import { nanoid } from '../node_modules/nanoid/non-secure/index.js';

const authentication = {
  loginForm: document.createElement('form'),

  load() {
    this.loginForm.id = 'login';
    this.loginForm.classList = 'mt-5 needs-validation';
    this.loginForm.setAttribute('novalidate', '');
    this.loginForm.append(createAuthCard(dataLogin));

    document.body.appendChild(this.loginForm);

    this.onClick = this.onClick.bind(this);
    this.loginForm.addEventListener('click', this.onClick);
  },

  unload() {
    this.loginForm.removeEventListener('click', this.onClick);
    this.loginForm.remove();
  },
  onClick(e) {
    const formData = Object.fromEntries(new FormData(this.loginForm));

    switch (e.target.id) {
      case 'btn-signup':
        this.loginForm.firstElementChild.remove();
        this.loginForm.append(createAuthCard(dataRegister, 'Rekisteröidy'));
        break;
      case 'btn-back':
        this.loginForm.firstElementChild.remove();
        this.loginForm.append(createAuthCard(dataLogin, 'Kirjaudu Sisään'));
        break;
      case 'btn-register':
        if (validateRegisterForm(formData)) {
          addNewUser(formData);
          console.log('Register successful');
        }
        break;
      case 'btn-login':
        if (checkLogin(formData)) {
          console.log('logging in...');
          loginUser(formData.username);
          this.unload();
        } else {
          console.log('invalid credentials');
        }
        break;
      default:
        return;
    }
  },
};

// TODO: clean this & maybe combine it with voteCardToDOM
// On selecting vote option add { voteid: CHOSEN_OPTION } to user's storage
const forms = document.querySelectorAll('.vote');
Array.from(forms).forEach((form) => {
  form.addEventListener('change', (event) => {
    event.preventDefault();
    const formData = getFormData(form);
    console.log(formData);
    const curUserName = localStorage.getItem('currentUser');
    const curUserData = getParsedFromStorage(curUserName);
    curUserData.voteData[form.id] = formData.option;
    localStorage.setItem(curUserName, JSON.stringify(curUserData));
  });
});

const pollModal = {
  modal: document.getElementById('pollAddingModal'),
  body: document.querySelector('.modal-body'),
  footer: document.querySelector('.modal-footer'),
  inputTitle: document.getElementById('fieldPollTitle'),
  inputOption: document.getElementById('fieldPollOpt'),
  previewTitle: document.getElementById('previewTitle'),

  load() {
    // TEMP: For debugging
    // const test = new bootstrap.Modal('#myModal');
    // const modal = bootstrap.Modal.getInstance('#myModal');
    // modal.show();

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

        progBar.classList.add('fs-6', 'position-relative', 'd-flex', 'align-baseline');
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

// UGLY
if (!localStorage.getItem('currentUser')) {
  authentication.load();
} else {
  document.getElementById('navCurrentUser').textContent = localStorage.getItem('currentUser');
  loadPollsFromStorage(); // TODO: Make previously checked options checked on load
}

pollModal.load();
