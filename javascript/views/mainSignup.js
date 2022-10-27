class mainSignup {
  _userUniqueId = '';
  _userIP = '';
  _completeUserSignupDet = {};
  _userDetailsfromHomepage = '';
  // class selections from homepageSignup
  _firstName = document.querySelector('.user-first-name');
  _lastName = document.querySelector('.user-last-name');
  _userEmail = document.querySelector('.user-email');
  _userSignupForm = document.querySelector('.user-signup--form');

  // class selections from mainSignup
  _mealPlan = document.querySelector('.plan');
  _userStreetAddress = document.querySelector('.street-address');
  _userCity = document.querySelector('.user-city');
  _userState = document.querySelector('.user-state');
  _userZipcode = document.querySelector('.user-zipcode');
  _userPass = document.querySelector('.user-password');
  _passWordError = document.querySelector('.pass-error');

  constructor() {
    this._getUserIP();
    setTimeout(() => {
      if (this._firstName && this._lastName && this._userEmail) {
        this._getUserSignupDet();
      }
    }, 600);
    this._signupFormHandler();
  }

  _generateUserID() {
    const firstname = this._firstName.value.trim().toLowerCase();
    const lastname = this._lastName.value.trim().toLowerCase();
    const email = this._userEmail.value.trim().toLowerCase().slice(0, 5);

    return (this._userUniqueId = `${firstname}${lastname}${email}`);
  }
  _getUserIP = async function () {
    const getUserIP = await fetch('https://api.ipify.org/');
    const userIP = await getUserIP.text();
    this._userIP = userIP;
  };
  _getQuery() {
    const mealPlan = this._mealPlan.value;
    const userStreetAddress = this._userStreetAddress.value;
    const userCity = this._userCity.value;
    const userState = this._userState.value;
    const userZipcode = this._userZipcode.value;
    const userPass = this._userPass.value;

    return (this._completeUserSignupDet = {
      firstName: this._userDetailsfromHomepage.firstName,
      lastName: this._userDetailsfromHomepage.lastName,
      email: this._userDetailsfromHomepage.email,
      mealPlan,
      userStreetAddress,
      userCity,
      userState,
      userZipcode,
      userPass,
      userId: this._userUniqueId,
    });
  }
  _clearInput() {
    this._mealPlan.value = '';
    this._userStreetAddress.value = '';
    this._userCity.value = '';
    this._userState.value = '';
    this._userZipcode.value = '';
    this._userPass.value = '';
    this._firstName.value = '';
    this._lastName.value = '';
    this._userEmail.value = '';
  }
  _removeFormError() {
    this._userPass.addEventListener(
      'keyup',
      function () {
        return (this._passWordError.textContent = '');
      }.bind(this)
    );
  }
  _getUserSignupDet = async function () {
    try {
      const resp = await fetch('https://omnifood-f1f8e-default-rtdb.firebaseio.com/homepagesignup.json');
      const userDetails = await resp.json();
      if (userDetails.userId === this._userIP) {
        const callUser = document.querySelector('.signup-user-text');
        callUser.innerHTML = '';
        callUser.insertAdjacentHTML(
          'afterbegin',
          `<h3 class="heading-username"> Hello ${userDetails.firstName},</h3>
            <p>We are missing some information, Please finish signing up to get started with your food plan. Your first meal will be on us!</p>`
        );

        this._firstName.value = userDetails.firstName;
        this._lastName.value = userDetails.lastName;
        this._userEmail.value = userDetails.email;
      }
      this._userDetailsfromHomepage = userDetails;
    } catch (error) {
      // console.log(error);
    }
  };

  _signupFormHandler() {
    this._userSignupForm?.addEventListener(
      'submit',
      function (event) {
        event.preventDefault();
        this._generateUserID();

        if (this._userPass.value.trim().length < 6) {
          this._userPass.focus();
          this._passWordError.textContent = 'Password should be atleat 6 characters';
          this._removeFormError();
          return;
        }
        this._completeUserSignupDet = this._getQuery();
        this._postCompleteUserSignupDet();
        this._userAuth();
        this._clearInput();
      }.bind(this)
    );
  }
  _postCompleteUserSignupDet = async function () {
    try {
      const response = await fetch('https://omnifood-f1f8e-default-rtdb.firebaseio.com/userSignupDet' + `/${this._userUniqueId}.json`, {
        method: 'PUT',
        body: JSON.stringify({ ...this._completeUserSignupDet }),
      });
      if (!response.ok) {
        throw new Error('There was an error signing up, please try again');
      }
      this._userSignupForm.classList.add('load-spinner');
    } catch (error) {
      alert(error.message);
    }
  };

  _userAuth() {
    const signUp = async () => {
      const URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyABO1FsOlL9zt39ZWZREC-wzWgVEr5LndA';
      const userData = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify({
          email: this._userEmail.value,
          password: this._userPass.value,
          returnSecureToken: true,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await userData.json();
      console.log(response);

      if (!response.ok) {
        if (response.error.message === 'EMAIL_EXISTS') {
          const errorMessage = "Account Already exists, you'll be logged in automatically :)";
          alert(errorMessage);
        }
        return;
      }
      this._userSignupForm.textContent = 'Account Successfully created!!';
    };
    signUp();
    setTimeout(() => {
      window.location.href = '/loggedUser.html';
    }, 1000);
  }
}
export default new mainSignup();
