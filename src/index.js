import './styles/style.css';

const Backbone = require('backbone');

const data = [
  { name: 'Ролло', phone: '+7(925)900-90-90' },
  { name: 'Боб', phone: '89259009090' },
  { name: 'Фрэнк', phone: '+79259009090' },
  { name: 'Рагнар', phone: '+7(925)900-90-90' },
  { name: 'Мэт', phone: '+7 925-900-90-90' }
];

const User = Backbone.Model.extend({
  defaults: {
    name: 'Не известно',
    phone: 'Не известно'
  }
});

const Users = Backbone.Collection.extend({
  model: User
});

const UserView = Backbone.View.extend({
  tagname: 'div',
  className: 'user',
  events: {
    'click .input__btn_edit': 'editUser',
    'click .input__btn_remove': 'removeUser',
    'submit .form__edit': 'saveChanges'
  },
  editUser() {
    this.el.innerHTML = '';
    this.el.appendChild(this.renderEditField());
  },
  removeUser() {
    this.remove(this);
  },
  saveChanges(event) {
    event.preventDefault();
    this.model.set({
      name: document.querySelector('.input__text_Editname').value,
      phone: document.querySelector('.input__text_Editphone').value
    });
    this.render();
  },
  renderEditField() {
    const element = document.createElement('div');

    const EditFieldString = `
      <form name="formEdit" class="form__edit">
        <div class="input input_edit">
          <div class="form__field">
            <input class="input__text input__text_Editname" type="text" name="name" placeholder="Имя" pattern = "^([А-ЯЁ][а-яё]+-[А-ЯЁ][а-яё]+)|([А-ЯЁ][а-яё]+)$" minlength="2" maxlength="20" value="${this.model.get(
              'name'
            )}" required>
            <span class="input__error">Не верный формат</span>
          </div>
          <div class="form__field">
            <input class="input__text input__text_Editphone" type="text" name="phone" placeholder="Телефон" pattern="^((\\+7)|8)\\s?((\\(\\d{3}\\))|(\\d{3}))\\s?-?\\d{3}-?\\d{2}-?\\d{2}$" minlength="11" maxlength="17" value="${this.model.get(
              'phone'
            )}" required>
            <span class="input__error">Не верный формат</span>
          </div>
            <button type="submit" class="input__btn input__btn_save">
            Сохранить
            </button>
        </div>
      </form>`;
    element.insertAdjacentHTML('beforeend', EditFieldString.trim());
    return element.firstChild;
  },
  render() {
    this.el.innerHTML = `<h4 class="user__name">${this.model.get('name')}</h4>
    <p class="user__phone">${this.model.get('phone')}</p>
    <button class="input__btn input__btn-user input__btn_edit">Изменить</button>
    <button class="input__btn input__btn-user input__btn_remove">X</button>`;
    return this;
  }
});

const UsersView = Backbone.View.extend({
  initialize() {
    this.model.on('add', this.onUserAdeded, this);
  },
  onUserAdeded(user) {
    const userView = new UserView({ model: user });

    this.el.appendChild(userView.render().el);
  },
  render() {
    this.model.each(user => {
      const userView = new UserView({ model: user });
      this.el.appendChild(userView.render().el);
    });
  }
});

const arr = [];
for (let i = 0; i < data.length; i++) {
  arr.push(new User({ name: data[i].name, phone: data[i].phone }));
}

const users = new Users(arr);

const usersView = new UsersView({ el: document.querySelector('.users-container'), model: users });
usersView.render();

document.forms.formAdd.addEventListener('submit', event => {
  event.preventDefault();
  users.set({
    name: document.querySelector('.input__text_name').value,
    phone: document.querySelector('.input__text_phone').value
  });
  document.forms.formAdd.reset();
});

// Readme
//
// Валидация имени:
//   - только кириллица
//   - первая буква заглавная
//   - можно ввести от 2 до 20 символов
//   - возможна запись двойных имён — например "Мария-Снежанна"

// Валидация телефона принимает следующие форматы:
//   - +7(925)900-90-90
//   - +7(925) 900-90-90
//   - +7 925-900-90-90
//   - +79259009090
//   - 89259009090
