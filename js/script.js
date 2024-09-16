import { checkLogin, loginUser, validateRegisterForm } from './login.js';
import { addNewUser, getParsedFromStorage } from './storage.js';
import { dataRegister, dataLogin, wizards } from './data.js';
import { createAuthCard, getFormData, voteCardToDOM } from './dom.js';
import { createModerationNav, pollModal } from './moderation.js';
// const loadedPolls = new Map();

const authentication = {
  loginForm: document.createElement('form'),

  load() {
    if (localStorage.getItem('currentUser')) {
      this.unload();
    } else {
      this.loginForm.id = 'login';
      this.loginForm.classList = 'mt-5 needs-validation';
      this.loginForm.setAttribute('novalidate', '');
      this.loginForm.append(createAuthCard(dataLogin));

      document.body.appendChild(this.loginForm);

      this.onClick = this.onClick.bind(this);
      this.loginForm.addEventListener('click', this.onClick);
    }
  },

  unload() {
    const currentUser = localStorage.getItem('currentUser');
    document.getElementById('navCurrentUser').textContent = currentUser;
    loadPollsFromStorage();

    this.loginForm.removeEventListener('click', this.onClick);
    this.loginForm.remove();

    if (wizards.includes(currentUser)) {
      pollModal.load();
      createModerationNav();
    }
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

// On selecting vote option add { voteid: CHOSEN_OPTION } to user's storage
const forms = document.querySelectorAll('.vote');
Array.from(forms).forEach((form) => {
  form.addEventListener('change', (event) => {
    event.preventDefault();
    const formData = getFormData(form);
    const curUserName = localStorage.getItem('currentUser');
    const curUserData = getParsedFromStorage(curUserName);
    curUserData.voteData[form.id] = formData.option;
    localStorage.setItem(curUserName, JSON.stringify(curUserData));
  });
});

function loadPollsFromStorage() {
  const votesFromStorage = getParsedFromStorage('polls');

  if (votesFromStorage) {
    Object.entries(votesFromStorage).forEach(([key, value]) => {
      value.id = key;
      const classObj = voteCardToDOM(value);
      // loadedPolls.set(key, classObj);
    });
  }
}

// Log off button
const allVotes = document.getElementById('all-votes');
document.getElementById('logoff').addEventListener('click', (e) => {
  while (allVotes.lastElementChild) {
    const last = allVotes.lastElementChild;
    // const cardClass = loadedPolls.get(last.id);
    last.remove();
  }
  localStorage.removeItem('currentUser');
  authentication.load();
});

authentication.load();
