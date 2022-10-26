class model {
  _userSignUpDet = {
    firstName: '',
    lastName: '',
    subscriptionPlan: '',
    email: '',
    phoneNumber: '',
    address: '',
    userStreetAddress: '',
    userCity: '',
    userState: '',
    userZipcode: '',
    userPass: '',
    uniqueId: '',
  };
  constructor() {}

  _userInputMainSignupHandler = function (userData) {
    this._userSignUpDet.firstName = userData.firstName;
    this._userSignUpDet.lastName = userData.lastName;
    this._userSignUpDet.email = userData.email;
    this._userSignUpDet.uniqueId = userData.userId;
    this._userSignUpDet.subscriptionPlan = userData.mealPlan;
    this._userSignUpDet.userStreetAddress = userData.userStreetAddress;
    this._userSignUpDet.userCity = userData.userCity;
    this._userSignUpDet.userState = userData.userState;
    this._userSignUpDet.userZipcode = userData.userZipcode;
    this._userSignUpDet.userZipcode = userData.userPass;
  };
}
export default new model();
