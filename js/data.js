export const wizards = ['root', 'Root', 'Admin', 'admin', 'wizard'];

export const dataRegister = {
  title: 'Rekisteröidy',
  fields: [
    {
      name: 'username',
      className: 'form-control',
      required: true,
      type: 'text',
      pattern: new RegExp('[A-Za-z0-9]{4,}'),
      autocomplete: 'username',
      placeholder: 'username',
      feedback: 'Must contain only lowercase letters and numbers, and at least 3 or more characters',
      value: 'joedoe',
    },
    {
      name: 'password',
      className: 'form-control',
      required: true,
      type: 'password',
      pattern: new RegExp('.{4,}'),
      autocomplete: 'current-password',
      placeholder: 'password',
      feedback: 'Password too short',
      value: 'A1adhwuhuhawdh',
    },
    {
      name: 'email',
      className: 'form-control',
      required: true,
      type: 'email',
      pattern: new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+[.][A-Za-z.]{2,}$'),
      autocomplete: 'email',
      placeholder: 'email',
      feedback: 'Not a valid email',
      value: 'example@test.com',
    },
  ],
  buttons: [
    {
      id: 'btn-register',
      className: 'btn btn-primary',
      type: 'button',
      textContent: 'Register',
    },
    {
      id: 'btn-back',
      className: 'btn btn-secondary',
      type: 'button',
      textContent: 'Never mind',
    },
  ],
};

export const dataLogin = {
  title: 'Kirjaudu Sisään',
  fields: [
    {
      name: 'username',
      className: 'form-control',
      required: false,
      type: 'text',
      autocomplete: 'username',
      placeholder: 'username',
    },
    {
      name: 'password',
      className: 'form-control',
      required: false,
      type: 'password',
      autocomplete: 'current-password',
      placeholder: 'password',
    },
  ],
  buttons: [
    {
      id: 'btn-login',
      className: 'btn btn-primary',
      type: 'button',
      textContent: 'Login',
    },
    {
      id: 'btn-signup',
      className: 'btn btn-secondary',
      type: 'button',
      textContent: 'Sign Up',
    },
  ],
};
