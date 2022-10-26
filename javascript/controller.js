import login from './views/login.js';
import mainSignup from './views/mainSignup.js';
import homepageSignup from './views/homepageSignup.js';
import { loggedUser } from './views/loggedUser.js';
import model from './model.js';
const completeUserSignupDetails = function () {
  const authenticatedUserData = login._accessAuthenticatedUserData;
  loggedUser(authenticatedUserData);
  model._userInputMainSignupHandler(authenticatedUserData);

  loggedUser(login._accessAuthenticatedUserData());
};
const init = function () {
  homepageSignup;
  mainSignup;
  login;
  completeUserSignupDetails();
};
init();
