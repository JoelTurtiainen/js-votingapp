import { checkLogin, validateRegisterForm } from './login.js';
import { addNewUser, pushToLocalStorage } from './storage.js';
import { dataRegister, dataLogin } from './inputs.js';
import { createActionCard } from './dom.js';

const authentication = {
  loginForm: document.createElement('form'),

  load() {
    this.loginForm.id = 'login';
    this.loginForm.classList = 'row g-3 m-5 d-sm needs-validation';
    this.loginForm.setAttribute('data-bs-theme', 'dark');
    this.loginForm.setAttribute('novalidate', '');
    this.loginForm.append(createActionCard(dataLogin, 'Kirjaudu Sisään'));

    document.body.insertBefore(this.loginForm, document.body.childNodes[4]);

    this.onClick = this.onClick.bind(this);
    this.loginForm.addEventListener('click', this.onClick);
  },

  onClick(e) {
    const formData = Object.fromEntries(new FormData(this.loginForm));

    switch (e.target.id) {
      case 'btn-signup':
        this.loginForm.firstElementChild.remove();
        this.loginForm.append(createActionCard(dataRegister, 'Rekisteröidy'));
        break;
      case 'btn-back':
        this.loginForm.firstElementChild.remove();
        this.loginForm.append(createActionCard(dataLogin, 'Kirjaudu Sisään'));
        break;
      case 'btn-register':
        if (validateRegisterForm(formData)) addNewUser(formData);
        break;
      case 'btn-login':
        checkLogin(formData) ? console.log('logging in...') : console.log('invalid credentials');
        break;
      default:
        return;
    }
  },
};

authentication.load();
