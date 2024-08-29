import { dataRegister, dataLogin } from '/js/inputs.js';
const loginForm = document.getElementById('login');

// Example starter JavaScript for disabling form submissions if there are invalid fields
// Fetch all the forms we want to apply custom Bootstrap validation styles to
(() => {
  'use strict';

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        const formData = Object.fromEntries(new FormData(form));
        if (event.submitter.id === 'btn-register' && validate(formData)) {
          addToLocalStorage(formData);
          console.log('valid');
        }
        if (event.submitter.id === 'btn-login') {
          checkLogin(formData);
        }
      },
      false
    );
  });
})();

// !!Server sided!! (if we had one)
function checkLogin(formData) {
  console.log(formData);
  const storageItem = JSON.parse(localStorage.getItem(formData.username));
  if (storageItem && formData.password === storageItem.password) {
    console.log('logging in...');
  } else {
    console.log('invalid credentials');
  }
}

// We would also do a second server-sided validation in real use
function validate(formData) {
  const required = document.querySelectorAll(':required');
  const data = dataRegister.fields;
  let valid = true;

  required.forEach((field) => {
    const { name, pattern, feedback } = data[field.name];
    const feedbackBox = field.nextElementSibling;
    const value = formData[name];

    // Check if name / email is taken
    if (localStorageHas(`${name}s`, value)) {
      feedbackBox.textContent = `${name} is already taken`;
      field.classList.add('is-invalid');
      valid = false;

      // Check if input matches the pattern
    } else if (!pattern.test(value)) {
      feedbackBox.textContent = feedback;
      field.classList.add('is-invalid');
      valid = false;

      // We change it to valid
    } else {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
    }
  });

  return valid;
}

function localStorageHas(key, item) {
  if (localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key)).includes(item);
  }
  return false;
}

function addToLocalStorage(formData) {
  const { username, email, password } = formData;
  pushToLocalStorage('usernames', username);
  pushToLocalStorage('emails', email);

  localStorage.setItem(username, JSON.stringify(formData));
}

function pushToLocalStorage(key, value) {
  const taken = JSON.parse(localStorage.getItem(key)) || [];
  taken.push(value);
  localStorage.setItem(key, JSON.stringify(taken));
}

loginForm.addEventListener('click', (e) => {
  let newCard;

  if (e.target.id === 'btn-signup') {
    // Create DOM screen for signing up
    newCard = createActionCard(dataRegister, 'Rekisteröidy');
  } else if (e.target.id === 'btn-back') {
    // Create DOM screeen for logging in
    newCard = createActionCard(dataLogin, 'Kirjaudu Sisään');
  }

  if (newCard) {
    loginForm.innerHTML = '';
    loginForm.appendChild(newCard);
  }
});

function createActionCard(inputElements, header) {
  const card = createCard(header);
  const btnDiv = createDiv('d-block');

  // Create input fields for the card
  for (const [key, field] of Object.entries(inputElements.fields)) {
    const input = createInput(field);
    const div = createDiv('pb-3');

    div.appendChild(input);

    // Optional feedback for invalid input
    if (field.feedback) {
      const divFeedback = createDiv('invalid-feedback');
      divFeedback.textContent = field.feedback;
      div.appendChild(divFeedback);
    }

    card.appendChild(div);
  }

  // Create buttons for card
  inputElements.buttons.forEach((item) => {
    btnDiv.appendChild(createBtn(item));
  });

  // Container for cards
  card.appendChild(btnDiv);

  return card;
}

function createCard(header) {
  const card = document.createElement('div');
  const title = document.createElement('div');

  // Card Container
  Object.assign(card, {
    classList: 'card text-center p-5 m-auto',
    'data-bs-theme': 'dark',
    style: 'width: 30rem',
  });

  // Card Title
  Object.assign(title, { classList: 'card-title m-4 h3', textContent: header });

  card.appendChild(title);

  return card;
}

function createInput(item) {
  const { name, required, type, pattern, autocomplete, placeholder, value } = item;
  const input = document.createElement('input');

  Object.assign(input, {
    name,
    className: 'form-control',
    type,
    placeholder,
    ...(autocomplete && { autocomplete }),
    // ...(pattern && { pattern }),
    ...(required && { required }),
    ...(value && { value }),
  });

  // input.setAttribute('required', '');
  return input;
}

function createBtn(obj) {
  const { id, className, type, textContent } = obj;
  const btn = document.createElement('button');
  const btnText = document.createTextNode(textContent);
  btn.appendChild(btnText);

  Object.assign(btn, {
    id,
    className,
    type,
  });

  return btn;
}

function createDiv(classList) {
  const div = document.createElement('div');
  div.classList = classList;
  return div;
}
