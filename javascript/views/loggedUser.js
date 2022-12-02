import login from './login.js';
export const loggedUser = async function () {
  const authUser = document.querySelector('.auth-user-acc');
  const generateBtn = document.querySelector('.generate-meals');
  const mealplanMemberBtn = document.querySelector('.meal-plan-btn');
  const loadMealContainer = document.querySelector('.loading-meals');
  const loadingText = document.querySelector('.meals-loading--text');
  const navMenuBtn = document.querySelector('.nav-mobile-btn');
  const mealsGeneratedModal = document.querySelector('.new-meals-gen');

  const userAuthData = await login._accessAuthenticatedUserData();

  const getUserDet = Object.values(userAuthData);

  const userDet = getUserDet[0];

  let fetchedResponseData = [];

  // const weekDays = ['Sunday', 'Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday'];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (!authUser) return;
  authUser.innerHTML = '';

  // ===========Generate 7 random numbers between 1-30 ==========
  let randomNumbers = [];
  for (let i = 0; i < 7; i++) {
    randomNumbers.push(Math.floor(Math.random() * 30) + 1);
  }
  // =================================================================
  //  Fetch meals from TheMealDB API====================
  const fetchMealsDisplay = async () => {
    const fetchMultipleCat = async (seafood, pork, american, pasta) => {
      // seafood
      const seafoodData = await fetch(seafood);
      const seafoodResponse = await seafoodData.json();
      fetchedResponseData.push({ ...seafoodResponse });
      // pork
      const porkData = await fetch(pork);
      const porkResponse = await porkData.json();
      fetchedResponseData.push(porkResponse);
      // america
      const americanData = await fetch(american);
      const americanResponse = await americanData.json();
      fetchedResponseData.push(americanResponse);
      // pasta
      const pastaData = await fetch(pasta);
      const pastaResponse = await pastaData.json();
      fetchedResponseData.push(pastaResponse);

      if (!seafoodData && !porkData && !americanData && !pastaData) alert('Our Meal-Plan generating AI is experiencing a technical difficulty. Please generate your plan Manually 🤦‍♀️');
    };
    // const URL = 'https://themealdb.com/api/json/v1/1/filter.php?a=American';
    // const userData = await fetch(URL);
    // const response = await userData.json();
    // fetchedResponseData.push(response);
    // if (!response) alert('Our Meal-Plan generating AI is experiencing a technical difficulty. Please generate your plan Manually 🤦‍♀️');

    const seafoodUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood';
    const porkUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Pork';
    const americanUrl = 'https://themealdb.com/api/json/v1/1/filter.php?a=American';
    const pastaUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Pasta';
    await fetchMultipleCat(seafoodUrl, porkUrl, americanUrl, pastaUrl);
  };

  await fetchMealsDisplay();
  // ========================================================

  // Dynamic heading based on Customer Meal Plan
  const starterHeading = `<p class="plan-description">As a reminder, your <strong>Starter-Plan Membership </strong> includes the following:</p>
            `;
  const completeHeading = `<p class="plan-description">As a reminder, your <strong>Complete-Plan Membership </strong>includes the following:</p>
           `;
  const starterDesc = `<div class="list-plan">
              <ul>
                <li>1 meal per day</li>
                <li>Order between 11am and 9pm</li>
                <li>Free Delivery</li>
              </ul>
            </div>`;
  const completeDesc = ` <div class="list-plan">
              <ul>
                <li>2 meal per day</li>
                <li>24/7 Order</li>
                <li>Free Delivery</li>
                <li>Access to latest recipes</li>
              </ul>
            </div>`;

  const starterMembership = `${starterHeading}${starterDesc}`;
  const completeMembership = `${completeHeading}${completeDesc}`;

  // =====================Display meals Dynamically====================
  const mealsHeaderDisplay = () => {
    const nonDynamiheader = `<div class="container">
    <h3 class="heading-greeting">Hello,</h3>
    ${
      /*userDet.mealPlan === 'starter' ? starterMembership : completeMembership
       */ ''
    }
    <p class="hero-description"><strong>Omnifood AI</strong> has generated the following weekly meal plan for you. You have an option to generate your own meal plan. Just do it within <strong> 24 hours.</strong></p>
    </div>`;
    authUser.insertAdjacentHTML('beforebegin', nonDynamiheader);
  };
  mealsHeaderDisplay();

  const mealDisplaymarkup = (randomMeals) => {
    const week = weekDays.map((day) => day);
    const day = new Date();
    const todayIs = day.getDay();
    randomMeals.map((meal, index) => {
      const mealsMarkup = ` 
      <div class="container">
      <div class="container container-display ">
        <div class="get-meals meal">
          <div class="center-text"><h3 class="heading-tertiary">${week[weekDays.length - index - 1]}</h3></div>
           <img src=${meal.strMealThumb} alt="${meal.strMeal}" />
          <div class="meal-content-container">
            <p class="meal-title">${meal.strMeal}</p>
            <ul class="meal-attributes">
              <li class="meal-attribute">
              </li>
              <li class="meal-attribute">
              </li>
            </ul>
          </div>
        </div>
        </div>
        </div>`;
      authUser.insertAdjacentHTML('afterbegin', mealsMarkup);
      [week[weekDays.length - index]].find((weekday) => {
        if (weekday === weekDays[todayIs])
          document.querySelector('.heading-tertiary').insertAdjacentHTML(
            'beforeend',
            ` <div class=" center-day meal-tags">
              <span class="tag tag--vegan">Today</span>
            </div>`
          );
        // document.querySelector('.heading-tertiary').style = 'green';
      });
    });
    loadingText.style.display = 'none';
    loadingText.style.visibility = 'hidden';
  };

  const combineAllMeals = () => {
    let fetchedResponseAllData = [];
    fetchedResponseAllData.push(...fetchedResponseData[0].meals);
    fetchedResponseAllData.push(...fetchedResponseData[1].meals);
    // fetchedResponseAllData.push(...fetchedResponseData[2].meals);
    fetchedResponseAllData.push(...fetchedResponseData[3].meals);
    return fetchedResponseAllData;
  };

  const mealsDisplay = () => {
    // const weeklyMeals = fetchedResponseData[0].meals.slice(0, 7);
    const allFetchedMeals = combineAllMeals();

    const shuffleMeals = Object.values(allFetchedMeals).sort(() => 0.5 - Math.random());
    let weeklyMeals = shuffleMeals.slice(0, 7);

    mealDisplaymarkup(weeklyMeals);
    // inserts dynamic HTMl on my-mealPlan Link
    const insertDynamicHtml = () => {
      const dynamicMeal = document.querySelector('.meal-dynamic');
      dynamicMeal.innerHTML = '';
      dynamicMeal.insertAdjacentHTML(
        'afterbegin',
        `<div class="hide-mealPlan meal-plan">
        <div class="meal-plan-content">
              <p class="meal-plan-title">You are a ${userDet.mealPlan === 'starter' ? 'Starter-Plan' : 'Complete-Plan'} Member 🎉:</p>
              ${userDet.mealPlan === 'starter' ? `${starterDesc}` : `${completeDesc}`}
              </div>
              </div>`
      );
    };
    insertDynamicHtml();
  };

  mealsDisplay();
  // ========================================================================================//
  // Generate Random Meals

  generateBtn.addEventListener('click', () => {
    const allFetchedMeals = combineAllMeals();
    const shuffleMeals = Object.values(allFetchedMeals).sort(() => 0.5 - Math.random());
    let weeklyMeals = shuffleMeals.slice(0, 7);
    authUser.innerHTML = '';
    mealDisplaymarkup(weeklyMeals);
    window.scrollTo({ top: 0 });

    mealsGeneratedModal.style.cssText = `
      visibility: visible;
      display: flex;
    `;
    setTimeout(() => {
      mealsGeneratedModal.style.cssText = `
      visibility: hidden;
      display: none;
      transition: 0.6s;`;
    }, 2000);
  });
  // =======================

  // Toggles insertDynamicHtml card when link clicked
  const MealPlanHandler = () => {
    const hideMeal = document.querySelector('.hide-mealPlan');
    mealplanMemberBtn.addEventListener('click', () => {
      hideMeal.classList.toggle('meal-plan');
      document.querySelector('.change-plan').classList.add('toggle-change-plan');
    });
    loadMealContainer.addEventListener('click', () => {
      hideMeal.classList.add('meal-plan');
    });
  };
  MealPlanHandler();
  //=========================================================

  const mealPlanApproval = () => {
    const approvalBtn = document.querySelector('.approval-icon');
    const approvalContainer = document.querySelector('.approve-mealplan');
    approvalContainer.addEventListener('click', () => {
      document.querySelector('.meal-approved').classList.add('show-plan-modal');
      setTimeout(() => {
        window.location.href = '/index.html';
      }, 3600);
    });
  };
  mealPlanApproval();

  const mobileMenuHandler = () => {
    const hideMeal = document.querySelector('.hide-mealPlan');
    const closeallModal = document.querySelector('.close-nav-modal');
    navMenuBtn.addEventListener('click', function () {
      document.querySelector('.nav').classList.toggle('hide-nav');
      navMenuBtn.classList.toggle('toggle-menu-icons');
      hideMeal.classList.add('meal-plan');
      document.querySelector('.change-plan').classList.add('toggle-change-plan');
    });
  };
  mobileMenuHandler();

  const changePlan = () => {
    const changePlan = document.querySelector('.change-plan');
    const changePlanBtn = document.querySelector('.change-plan-btn');
    const selectedPlan = document.querySelector('.plan');
    const submitPlan = document.querySelector('.change-plan-form');
    const errorMessage = document.querySelector('.change-plan-error');
    const successMessage = document.querySelector('.change-plan-success');
    changePlanBtn.addEventListener('click', () => {
      changePlan.classList.toggle('toggle-change-plan');
      document.querySelector('.hide-mealPlan').classList.add('meal-plan');
    });
    // Start of Change Meal Plan in the Database
    const putMealPlanrequest = async () => {
      try {
        await fetch('https://omnifood-f1f8e-default-rtdb.firebaseio.com/userSignupDet' + `/${userDet.userId}/mealPlan.json`, {
          method: 'PUT',
          body: JSON.stringify(selectedPlan.value),
        });
      } catch (error) {
        console.log(error);
      }
    };
    // End of Change meal Plan in the Database
    submitPlan.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (userDet.mealPlan === selectedPlan.value) {
        errorMessage.textContent = `You are already a ${userDet.mealPlan}-Plan Member`;
        setTimeout(() => {
          document.querySelector('.change-plan').classList.add('toggle-change-plan');
          errorMessage.textContent = '';
          selectedPlan.value = '';
        }, 2000);
      } else {
        // userDet.mealPlan = selectedPlan.value;
        await putMealPlanrequest();
        successMessage.textContent = `Your Plan has been Changed Successfully`;
        setTimeout(() => {
          location.reload();
          document.querySelector('.change-plan').classList.add('toggle-change-plan');
          successMessage.textContent = '';
          selectedPlan.value = '';
        }, 2000);
      }
      console.log(userDet);
    });
    loadMealContainer.addEventListener('click', () => {
      document.querySelector('.change-plan').classList.add('toggle-change-plan');
    });
  };
  changePlan();
};
loggedUser();
