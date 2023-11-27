function app() {
  /**
   * Handle states for Search Input to add class to search box
   */
  const searchBox = document.querySelector("#search-box");
  const searchInput = document.querySelector("#search-input");

  // Search input focus event listener
  searchInput.addEventListener("focus", function () {
    searchBox.classList.add("search-box--active");
  });

  // search input blur event listenet
  searchInput.addEventListener("blur", (e) => {
    searchBox.classList.remove("search-box--active");
  });

  /**
   * Toggle setup guide
   */
  const setupGuideToggle = document.querySelector("#setup-guide-toggle");
  const setupGuide = document.querySelector("#setup-guide");
  const guides = document.querySelectorAll(".guide");

  // open step
  const openStep = (step) => {
    guides.forEach((guide, guideIndex) => {
      // open passed step
      if (guideIndex === step) guide.classList.add("guide--active");

      // close other steps
      if (guideIndex !== step) guide.classList.remove("guide--active");
    });
  };

  // open setup steps
  const openSetupGuide = function () {
    // add open css class
    setupGuide.classList.add("open");

    // update aria attributes
    // change label
    setupGuideToggle.ariaLabel = "Close setup guide process";

    // change aria-expanded to true
    setupGuideToggle.ariaExpanded = "true";
  };

  // close setup steps
  const closeSetupGuide = function () {
    // remove open cs class
    setupGuide.classList.remove("open");

    // update aria attributes
    // change label
    setupGuideToggle.ariaLabel = "Open setup guide process";

    // change aria-expanded to false
    setupGuideToggle.ariaExpanded = "false";
  };

  // toggle setup guide
  // open guide if closed and close guide if opened
  const toggleSetupGuide = function () {
    const isOpened =
      setupGuideToggle.attributes["aria-expanded"].value === "true";

    if (isOpened) {
      closeSetupGuide();
    } else {
      openSetupGuide();
    }
  };

  // adding toggle event listener
  setupGuideToggle.addEventListener("click", toggleSetupGuide);

  /**
   * Guide Process and Progress Update
   */
  const stepCheckboxes = document.querySelectorAll(".guide__check");
  const guideHeadings = document.querySelectorAll(".guide__heading");

  const progressEl = document.querySelector("#progress");
  const progressCountEl = document.querySelector("#progress-count");

  const stepsCompleted = [false, false, false, false, false];

  // update completed step count and update progress bar
  const updateStepsProgress = (step) => {
    let filledCount = 0;

    let uncompletedBefore;
    let uncompletedAfter;

    /**
     * Counts filled and checks next or previous uncompleted steps
     */
    stepsCompleted.forEach((stepCompleted, stepIndex) => {
      if (stepCompleted) {
        filledCount += 1;

        return;
      }

      if (uncompletedBefore === undefined && stepIndex < step - 1) {
        uncompletedBefore = stepIndex;
      }

      if (uncompletedAfter === undefined && stepIndex > step - 1) {
        uncompletedAfter = stepIndex;
      }
    });

    const filledPercentage = (filledCount / 5) * 100;

    progressEl.style.width = `${filledPercentage}%`;
    progressCountEl.innerHTML = filledCount;

    if (uncompletedAfter !== undefined) return uncompletedAfter;
    if (uncompletedBefore !== undefined) return uncompletedBefore;
  };

  const finishUpStepCheck = function (step) {
    const stepToOpen = updateStepsProgress(step);

    if (stepToOpen !== undefined) openStep(stepToOpen);
  };

  // step complete toggle checkbox event handler
  // 1. check if unchecked and uncheck if checked
  // 2. Opens the next uncompleted step
  const stepCheckboxHandler = function () {
    const guide = this.closest(".guide");
    const checkboxButtonStatus = guide.querySelector(".guide__status");

    const isChecked = this.attributes["aria-checked"].value === "true";

    const currentStep = +guide.dataset.step;

    if (isChecked) {
      this.classList.remove("completed");
      this.classList.add("loading");

      checkboxButtonStatus.ariaLabel = "Loading. Please wait...";

      setTimeout(() => {
        this.ariaChecked = "false";

        checkboxButtonStatus.ariaLabel =
          "Successfully " + this.ariaLabel.toLowerCase();

        this.ariaLabel = this.ariaLabel.replace("as done", "as not done");

        stepsCompleted[currentStep - 1] = false;

        this.classList.remove("loading");

        finishUpStepCheck(currentStep);
      }, 2000);
    } else {
      this.classList.add("loading");

      checkboxButtonStatus.ariaLabel = "Loading. Please wait...";

      setTimeout(() => {
        this.ariaChecked = "true";

        checkboxButtonStatus.ariaLabel =
          "Successfully " + this.ariaLabel.toLowerCase();

        this.ariaLabel = this.ariaLabel.replace("as not done", "as done");

        stepsCompleted[currentStep - 1] = true;

        this.classList.remove("loading");
        this.classList.add("completed");

        finishUpStepCheck(currentStep);
      }, 2000);
    }
  };

  // Event listener to step checkbox
  stepCheckboxes.forEach((stepCheckbox) => {
    stepCheckbox.addEventListener("click", stepCheckboxHandler);
  });

  // guide heading event handler
  // open guide process if not active
  guideHeadings.forEach((guideHeading, guideIndex) =>
    guideHeading.addEventListener("click", function (event) {
      event.preventDefault();

      openStep(guideIndex);
    })
  );

  /**
   * Toggle notifications
   */
  const notificationsToggle = document.querySelector("#notifications-toggle");
  const notificationsBlock = document.querySelector("#notifications-block");
  const filterNotifications = document.querySelector("#filter-notifications");

  // close notifications block
  const closeNotificationsBlock = (focus = true) => {
    notificationsBlock.classList.add("hidden");

    notificationsToggle.ariaExpanded = "false";

    if (focus) notificationsToggle.focus();
  };

  // handle escape event
  function handleNotificationsBlockEscape(event) {
    if (event.key === "Escape") closeNotificationsBlock();
  }

  // open notifications block
  const openNotificationsBlock = () => {
    notificationsBlock.classList.remove("hidden");

    notificationsToggle.ariaExpanded = "true";

    filterNotifications.focus();

    notificationsBlock.addEventListener(
      "keyup",
      handleNotificationsBlockEscape
    );
  };

  // toggle notifications block
  const toggleNotificationsBlock = function () {
    const isOpened =
      notificationsToggle.attributes["aria-expanded"].value === "true";

    if (isOpened) {
      closeNotificationsBlock();
    } else {
      openNotificationsBlock();
    }
  };

  // add listener for notifications toggle
  notificationsToggle.addEventListener("click", toggleNotificationsBlock);

  notificationsBlock.addEventListener("focusout", function (event) {
    // Check if the newly focused element is outside the popup and closes it
    if (
      !this.contains(event.relatedTarget) &&
      event.relatedTarget !== notificationsToggle
    )
      closeNotificationsBlock(false);
  });

  /**
   * Toggle user profile menu
   */
  const userMenuToggle = document.querySelector("#user-profile-menu-toggle");
  const userMenuBlock = document.querySelector("#user-profile-menu");
  const userMenuItems = userMenuBlock.querySelectorAll("[role='menuitem']");

  // close user menu
  const closeUserMenu = (focus = true) => {
    userMenuBlock.classList.add("hidden");

    userMenuToggle.ariaExpanded = "false";

    if (focus) userMenuToggle.focus();
  };

  // handle escape event
  function handleUserMenuEscape(event) {
    if (event.key === "Escape") closeUserMenu();
  }

  // handle navigate with arrow keys
  function handleMenuNavigateEvent(event, index) {
    const isFirstItem = index === 0;
    const isLastItem = index === userMenuItems.length - 1;

    const previousItem = index - 1;
    const nextItem = index + 1;

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      if (isFirstItem) {
        userMenuItems.item(userMenuItems.length - 1).focus();

        return;
      }

      userMenuItems.item(previousItem).focus();
    } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      if (isLastItem) {
        userMenuItems.item(0).focus();

        return;
      }

      userMenuItems.item(nextItem).focus();
    }
  }

  // open user menu
  const openUserMenu = () => {
    userMenuBlock.classList.remove("hidden");

    userMenuToggle.ariaExpanded = "true";

    userMenuItems.item(0).focus();

    userMenuBlock.addEventListener("keyup", handleUserMenuEscape);

    userMenuItems.forEach((menuItem, menuItemIndex) => {
      menuItem.addEventListener("keyup", function (event) {
        handleMenuNavigateEvent(event, menuItemIndex);
      });
    });
  };

  // toggle user menu
  const toggleUserMenu = function () {
    const isOpened =
      userMenuToggle.attributes["aria-expanded"].value === "true";

    if (isOpened) {
      closeUserMenu();
    } else {
      openUserMenu();
    }
  };

  // add user menu toggle event listener
  userMenuToggle.addEventListener("click", toggleUserMenu);

  userMenuBlock.addEventListener("focusout", function (event) {
    // Check if the newly focused element is outside the popup and closes it
    if (
      !this.contains(event.relatedTarget) &&
      event.relatedTarget !== userMenuToggle
    )
      closeUserMenu(false);
  });

  /**
   * Close extend trial alert
   */
  const info = document.querySelector("#info");
  const infoClose = document.querySelector("#info-close");

  infoClose.addEventListener("click", function () {
    info.classList.add("hidden");
  });
}

app();
