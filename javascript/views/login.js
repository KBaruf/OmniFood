class Login {
  _AuthenticatedUserData = {};
  _userUniqueId = '';

  _loginBtn = document.querySelector('.login-btn');
  _promptLogin = document.querySelector('.prompt-login');
  _formLogin = document.querySelector('.form-user-login');
  _formBox = document.querySelector('.login-form');
  _formOverlay = document.querySelector('.overlay');
  _closeLogin = document.querySelector('.close-login');
  _error = document.querySelector('.error');

  // query id selection

  // _btnLogin = document.querySelector('.btn-login');
  _firstName = document.querySelector('.user-first-name');
  _lastName = document.querySelector('.user-last-name');
  _userEmail = document.querySelector('.userLogin-email');
  _password = document.querySelector('.user-password');

  constructor() {
    if (this._loginBtn) this._loginBtn.addEventListener('click', this._loginModalHandler.bind(this));
    if (this._promptLogin) this._promptLogin.addEventListener('click', this._promptLoginHandler.bind(this));
    if (this._formOverlay) this._formOverlay.addEventListener('click', this._overlayHandler.bind(this));
    if (this._closeLogin) this._closeLogin.addEventListener('click', this._closeHandler.bind(this));
    this._loginHandler();
    this._accessAuthenticatedUserData();
  }

  _loginModalHandler() {
    this._formLogin.classList.add('show-form');
    this._formOverlay.classList.add('show-form');
  }
  _promptLoginHandler() {
    this._loginModalHandler();
    document.querySelector('.login-heading').insertAdjacentHTML('beforebegin', `<p class='center-text prompt-user--login '>Please Login to Choose Your Meal.</p>`);
  }
  _closeHandler() {
    this._formLogin.classList.remove('show-form');
    this._formOverlay.classList.remove('show-form');
  }
  _overlayHandler() {
    this._formLogin.classList.remove('show-form');
    this._formOverlay.classList.remove('show-form');
  }

  _clearInput() {
    this._userEmail.value = '';
    this._password.value = '';
    this._firstName.value = '';
    this._lastName.value = '';
  }
  _invalidEmail() {
    const errorLogin = document.querySelector('.login-error');
    this._error.classList.remove('error-login');
    errorLogin.style.color = '#c1210f';
    errorLogin.textContent = 'ENTERED EMAIL NOT FOUND !!';
  }
  _invalidPassword() {
    this._error.classList.remove('error-login');
    const errorLogin = document.querySelector('.login-error');
    errorLogin.style.color = '#c1210f';
    errorLogin.textContent = 'INVALID PASSWORD !!';
  }

  _loginSuccess() {
    const loginError = document.querySelector('.login-error');
    this._error.classList.remove('error-login');
    loginError.style.color = '#51cf66';
    loginError.textContent = 'LOGIN SUCESSFUL';
  }
  _loginHandler() {
    this._formBox?.addEventListener(
      'submit',
      async function (event) {
        event.preventDefault();
        const loginEmail = this._userEmail.value;
        const loginPass = this._password.value;
        try {
          this._formBox.classList.add('load-spinner');

          const URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyABO1FsOlL9zt39ZWZREC-wzWgVEr5LndA';
          const userData = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify({
              email: loginEmail,
              password: loginPass,
              returnSecureToken: true,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const response = await userData.json();

          this._generateUserID();

          if (response.error && !response.ok) {
            if (response.error.message === 'INVALID_PASSWORD') {
              this._invalidPassword();
              this._password.focus();
              this._formBox.classList.remove('load-spinner');
              return;
            }
            if (response.error.message === 'EMAIL_NOT_FOUND') {
              this._invalidEmail();
              this._userEmail.focus();
              this._formBox.classList.remove('load-spinner');
              return;
            }
            return;
          }

          this._clearInput();
          if (response.registered === true && response.idToken) {
            this._loginSuccess();
            setTimeout(async () => {
              window.location.href = 'http://localhost:5500/loggedUser.html';
              this._formBox.classList.remove('load-spinner');
            }, 1800);
          }
        } catch (error) {
          console.log(error);
        }
      }.bind(this)
    );
  }
  _generateUserID() {
    const firstname = this._firstName.value.trim().toLowerCase();
    const lastname = this._lastName.value.trim().toLowerCase();
    const email = this._userEmail.value.trim().toLowerCase().slice(0, 5);

    return (this._userUniqueId = `${firstname}${lastname}${email}`);
  }

  _accessAuthenticatedUserData = async function () {
    try {
      const response = await fetch('https://omnifood-f1f8e-default-rtdb.firebaseio.com/userSignupDet' + `/${this._userUniqueId}.json`);
      if (!response.ok) {
        throw new Error('There was an error signing up, please try again');
      }
      const authUserData = await response.json();
      return authUserData;
    } catch (error) {
      console.log(error);
    }
  };
}
export default new Login();
