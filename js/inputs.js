export const dataRegister = {
  fields: {
    username: {
      name: 'username',
      required: true,
      type: 'text',
      pattern: /^[a-z0-9_-]{3,15}$/,
      autocomplete: 'username',
      placeholder: 'username',
      feedback:
        'Must contain only lowercase letters and numbers, and at least 3 or more characters',
      value: 'joedoe',
    },
    password: {
      name: 'password',
      required: true,
      type: 'password',
      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      autocomplete: 'current-password',
      placeholder: 'password',
      feedback:
        'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters',
      value: 'A1adhwuhuhawdh',
    },
    email: {
      name: 'email',
      required: true,
      type: 'email',
      pattern: new RegExp('[A-Za-z0-9]{4,}'),
      autocomplete: 'email',
      placeholder: 'email',
      feedback: 'Not a valid email',
      value: 'example@test.com',
    },
  },
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
  fields: [
    {
      name: 'username',
      required: false,
      type: 'text',
      autocomplete: 'username',
      placeholder: 'username',
    },
    {
      name: 'password',
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
