import mainSignup from './mainSignup.js';
class HomepageSignup {
  _signupForm = document.querySelector('.signup-form');
  _firstLastName = document.querySelector('.user-full-name');
  _emailAddress = document.querySelector('.user-email');

  _navMenuBtn = document.querySelector('.nav-mobile-btn');

  _firstName = '';
  _lastName = '';
  _email = '';
  _userIP = '';
  _userSignupDet = {};

  constructor() {
    this._signupHandler();
    this._getUserIP();
    this._stickeyHeaderHandler();
    this._mobileMenuHandler();
    this._hidesignUpBtn();
    this._closeModalWhenSrolling();
    this._allLinksEventListener();
  }
  _getUserIP = async function () {
    const getUserIP = await fetch('https://api.ipify.org/');
    const userIP = await getUserIP.text();
    this._userIP = userIP;
  };
  _stickeyHeaderHandler() {
    const header = document.querySelector('.header');
    const sectionHero = document.querySelector('.section-hero');
    window.addEventListener('scroll', () => {
      const secHero = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) {
          header.classList.add('sticky-header');
        } else {
          header.classList.remove('sticky-header');
        }
      });
      secHero.observe(sectionHero);
    });
  }
  _getQuery() {
    this._fullName = this._firstLastName.value;
    this._email = this._emailAddress.value;
    const nameError = document.querySelector('.name-error');
    if (this._fullName) {
      const splittedName = this._fullName.split(' ');
      if (splittedName && splittedName.length >= 3) {
        nameError.textContent = 'Only First and Last Name is required';
        this._firstLastName.focus();
        return;
      }
      if (splittedName && splittedName.length === 1) {
        nameError.textContent = 'Please Include your Last Name';
        this._firstLastName.focus();
        return;
      } else {
        nameError.textContent = '';
      }
      this._firstName = splittedName[0];
      this._lastName = splittedName[1];
    }
    if (this._email) {
      const emailError = document.querySelector('.email-error');
      const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!this._email.trim().match(mailformat)) {
        emailError.textContent = 'Invalid Email Address!';
        this._emailAddress.focus();
        return;
      } else {
        emailError.textContent = '';
      }
    }
    this._clearInput();
    return (this._userSignupDet = {
      firstName: this._firstName,
      lastName: this._lastName,
      email: this._email,
      userId: this._userIP,
    });
  }

  _clearInput() {
    this._firstLastName.value = '';
    this._emailAddress.value = '';
  }

  _postHomePageSignupDet = async function () {
    try {
      const response = await fetch('https://omnifood-f1f8e-default-rtdb.firebaseio.com/homepagesignup.json', {
        method: 'PUT',
        body: JSON.stringify({ ...this._userSignupDet }),
      });
      if (!response.ok) {
        throw new Error('There was an error signing up, please try again');
      }
    } catch (error) {
      // alert(error.message);
    }
  };
  _signupHandler() {
    this._signupForm.addEventListener(
      'submit',
      function (event) {
        event.preventDefault();
        this._getQuery();
        const userInfoToArray = Object.values(this._userSignupDet);
        if (userInfoToArray.length > 0) {
          this._postHomePageSignupDet();
          this._signupForm.classList.add('load-spinner');

          this._getUserIP();
          setTimeout(() => {
            window.location.href = '/signup.html';
          }, 200);
        } else {
          return;
        }
      }.bind(this)
    );
  }
  _mobileMenuHandler() {
    this._navMenuBtn.addEventListener(
      'click',
      function () {
        document.querySelector('.nav').classList.toggle('hide-nav');
        this._navMenuBtn.classList.toggle('toggle-menu-icons');
      }.bind(this)
    );
  }
  // Hide "Try For Free Btn" if the user has already signed up
  _hidesignUpBtn() {
    const navSignup = document.querySelector('.nav-signup-btn');
    const signedUpUserDet = mainSignup._completeUserSignupDet;
    if (Object.keys(signedUpUserDet).length !== 0) {
      navSignup.style.display = 'none';
    }
    // if (signedUpUserDet.length > 0) navSignup.style.display = 'block';
  }
  _closeModalWhenSrolling() {
    window.addEventListener(
      'scroll',
      function () {
        document.querySelector('.nav').classList.add('hide-nav');
        this._navMenuBtn.classList.remove('toggle-menu-icons');
      }.bind(this)
    );
  }
  _allLinksEventListener() {
    const links = document.getElementsByTagName('a:href');
    // const linkattribute = links.getAttribute('id');
    const allLinks = document.getElementById('linkattribute');

    links.foreach((link) => {
      const linkAttribute = link.getAttribute('id');
      const allLinks = document.getElementById(linkAttribute);
      allLinks.addEventListener(
        'click',
        function () {
          console.log(linkAttribute);
        }.bind(this)
      );
    });
  }
}
export default new HomepageSignup();
