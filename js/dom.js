export function createActionCard(inputElements, header) {
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

export function createCard(header) {
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

export function createInput(item) {
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

export function createBtn(obj) {
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

export function createDiv(classList) {
  const div = document.createElement('div');
  div.classList = classList;
  return div;
}
