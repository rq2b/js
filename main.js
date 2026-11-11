class ATM {
  #balance;
  #pin;
  #failedAttempts;
  #history;
  #isBlocked;
  #isAuthorized;

  constructor(balance, pin) {
    this.#balance = balance;
    this.#pin = pin;
    this.#failedAttempts = 0;
    this.#history = [];
    this.#isBlocked = false;
    this.#isAuthorized = false;
  }

  #checkAccess() {
    if (this.#isBlocked) throw new Error("Банкомат заблокирован");
    if (!this.#isAuthorized) throw new Error("Нужно авторизоваться");
  }

  authorize(pin) {
    if (this.#isBlocked) throw new Error("Банкомат заблокирован");

    if (pin !== this.#pin) {
      this.#failedAttempts++;

      if (this.#failedAttempts >= 3) {
        this.#isBlocked = true;
        throw new Error("Банкомат заблокировался после трех неправильных попыток");
      }

      throw new Error("Неверный PIN-код");
    }

    this.#failedAttempts = 0;
    this.#isAuthorized = true;
    console.log("Авторизация успешна");
  }

  deposit(amount) {
    this.#checkAccess();

    if (typeof amount !== "number" || !isFinite(amount) || amount <= 0) {
      throw new Error("Сумма пополнения должна быть положительной");
    }

    this.#balance += amount;
    this.#history.push(`Пополнение: +${amount} грн`);
    console.log(`Баланс пополнен на ${amount} грн`);
  }

  withdraw(amount) {
    this.#checkAccess();

    if (typeof amount !== "number" || !isFinite(amount) || amount <= 0) {
      throw new Error("Сумма снятия должна быть положительной");
    }

    if (amount > 5000) throw new Error("Лимит снятия за одну операцию - 5000 грн");
    if (amount > this.#balance) throw new Error("Недостаточно средств на балансе");

    this.#balance -= amount;
    this.#history.push(`Снятие: -${amount} грн`);
    console.log(`Снято ${amount} грн`);
  }

  showBalance() {
    this.#checkAccess();
    console.log(`Текущий баланс: ${this.#balance} грн`);
  }

  showHistory() {
    this.#checkAccess();

    console.log("История операций:");

    if (this.#history.length === 0) {
      console.log("Операций пока нет");
      return;
    }

    for (let operation of this.#history) {
      console.log(operation);
    }
  }

  changePin(oldPin, newPin) {
    this.authorize(oldPin);

    if (typeof newPin !== "string" || newPin.length !== 4) {
      throw new Error("Новый PIN-код должен состоять из четырех цифр");
    }

    for (let i = 0; i < newPin.length; i++) {
      if (newPin[i] < "0" || newPin[i] > "9") {
        throw new Error("PIN-код должен содержать только цифры");
      }
    }

    if (newPin === this.#pin) {
      throw new Error("Новый PIN-код не должен совпадать со старым");
    }

    this.#pin = newPin;
    console.log("PIN-код успешно изменен");
  }
}


const atm = new ATM(10000, "1234");
const blocked_atm = new ATM(5000, "4321");


try {
  atm.authorize("1234");
} catch (error) {
  console.log(error.message);
}


try {
  atm.deposit(2500);
} catch (error) {
  console.log(error.message);
}


try {
  atm.withdraw(3000);
} catch (error) {
  console.log(error.message);
}


try {
  atm.withdraw(6000);
} catch (error) {
  console.log(error.message);
}


try {
  atm.showBalance();
} catch (error) {
  console.log(error.message);
}


try {
  atm.showHistory();
} catch (error) {
  console.log(error.message);
}


try {
  atm.changePin("1234", "5678");
} catch (error) {
  console.log(error.message);
}


try {
  atm.authorize("5678");
} catch (error) {
  console.log(error.message);
}



try {
  blocked_atm.authorize("0000");
} catch (error) {
  console.log(error.message);
}


try {
  blocked_atm.authorize("0000");
} catch (error) {
  console.log(error.message);
}


try {
  blocked_atm.authorize("0000");
} catch (error) {
  console.log(error.message);
}

