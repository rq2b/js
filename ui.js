export function show_message(message) {
  let message_element = document.getElementById("message");

  if (message_element.textContent != "") {
    message_element.textContent += `\n${message}`;
    return;
  }

  message_element.textContent = message;
}

export function choose(question, options, callback) {
  let actions = document.getElementById("actions");

  actions.innerHTML = "";
  show_message(question);

  for (let option of options) {
    let button = document.createElement("button");

    button.textContent = option.text;

    button.onclick = function() {
      actions.innerHTML = "";
      document.getElementById("message").textContent = "";
      callback(option.value);
    };

    actions.appendChild(button);
  }
}
