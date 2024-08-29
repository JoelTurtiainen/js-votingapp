import { dataRegister, dataLogin } from './inputs.js';
import { localStorageHas } from './storage.js';

// !!Server sided!! (if we had one)
export function checkLogin(formData) {
  console.log(formData);
  const storageItem = JSON.parse(localStorage.getItem(formData.username));
  if (storageItem && formData.password === storageItem.password) {
    return true;
  } else {
    return false;
  }
}

// We would also do a second server-sided validation in real use
export function validateRegisterForm(formData) {
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
