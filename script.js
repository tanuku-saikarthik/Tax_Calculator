$(document).ready(function() {
  const elements = {
    incomeInput: $('#income'),
    extraIncomeInput: $('#extraIncome'),
    deductionsInput: $('#deductions'),
    ageSelect: $('#age'),
    errorMessage: $('#errorMessage'),
    incomeErrorElement: $('#incomeError'),
    extraIncomeErrorElement: $('#extraIncomeError'),
    deductionsErrorElement: $('#deductionsError'),
    ageErrorElement: $('#ageError')
  };

  $("#incomeinfo").hover(function() {
    $("#infoBox").css("display", "block");
  }, function() {
    $("#infoBox").css("display", "none");
  });

  $("#extrainfo").hover(function() {
    $("#infoBoxe").css("display", "block");
  }, function() {
    $("#infoBoxe").css("display", "none");
  });

  $("#deductionsinfo").hover(function() {
    $("#infoBoxd").css("display", "block");
  }, function() {
    $("#infoBoxd").css("display", "none");
  });

  // Event listener for form submission
  $('#submitBtn').on('click', function() {
    validateForm(elements);
  });

  // Event listeners for input fields
  elements.incomeInput.on('input', function() {
    validateInput(elements.incomeInput, elements.incomeErrorElement);
  });

  elements.extraIncomeInput.on('input', function() {
    if (elements.extraIncomeInput.val().trim() !== '') {
      validateInput(elements.extraIncomeInput, elements.extraIncomeErrorElement);
    } else {
      hideError(elements.extraIncomeErrorElement);
    }
  });

  elements.deductionsInput.on('input', function() {
    if (elements.deductionsInput.val().trim() !== '') {
      validateInput(elements.deductionsInput, elements.deductionsErrorElement);
    } else {
      hideError(elements.deductionsErrorElement);
    }
  });

  elements.ageSelect.on('change', function() {
    validateAge(elements);
  });

  // Event listener for closing the modal
  $('.close').on('click', function() {
    closeModal();
  });

  // Event listener for clicking outside the modal
  $(window).on('click', function(event) {
    if (event.target === $('#modal')[0]) {
      closeModal();
    }
  });
});

function validateForm(elements) {
  if (elements.incomeInput.val().trim() === '' || elements.ageSelect.val().trim() === '') {
    alert("Please fill Gross Annual Income and Age fields");
  } else {
    const isIncomeValid = validateInput(elements.incomeInput, elements.incomeErrorElement);
    const isExtraIncomeValid = elements.extraIncomeInput.val().trim() === '' || validateInput(elements.extraIncomeInput, elements.extraIncomeErrorElement);
    const isDeductionsValid = elements.deductionsInput.val().trim() === '' || validateInput(elements.deductionsInput, elements.deductionsErrorElement);
    const isAgeValid = validateAge(elements);

    // Check if deductions exceed gross income + extra income
    const grossIncome = parseFloat(elements.incomeInput.val() || 0);
    const extraIncome = parseFloat(elements.extraIncomeInput.val() || 0);
    const deductions = parseFloat(elements.deductionsInput.val() || 0);
    const totalIncome = grossIncome + extraIncome;

    if (isIncomeValid && isExtraIncomeValid && isDeductionsValid && isAgeValid) {
      if (deductions > totalIncome) {
        alert("Deductions cannot exceed Gross Income plus Extra Income");
        showError(elements.errorMessage, "Deductions cannot exceed Gross Income plus Extra Income.");
        return;// Exit the function if there's an error
      }

      hideError(elements.errorMessage);
      
      const tax = calculateTax(totalIncome - deductions, elements.ageSelect.val());
      showModal(tax);
    } else {
      showError(elements.errorMessage, "Please fill in all required fields.");
    }
  }
}

function calculateTax(totalIncome, ageGroup) {
  if (totalIncome > 8) {
    if (ageGroup === "<40") {
      return 0.3 * (totalIncome - 8);
    } else if (ageGroup === ">=40 <60") {
      return 0.4 * (totalIncome - 8);
    } else if (ageGroup === ">=60") {
      return 0.1 * (totalIncome - 8);
    }
  }
  return 0;
}

function validateInput(input, errorElement) {
  if (input.val().trim() === '') {
    $(".error-tooltip", errorElement.parent()).text("Please enter a value.");
    return false;
  }
  if (input.val() < 0) {
    $(".error-tooltip", errorElement.parent()).text("Invalid input: please enter a positive number.");
    errorElement.css('display', 'inline');
    return false;
  }
  const isValid = !isNaN(input.val());
  errorElement.css('display', isValid ? 'none' : 'inline');
  $(".error-tooltip", errorElement.parent()).text("Please enter a valid number.");
  return isValid;
}

function validateAge(elements) {
  const isValid = elements.ageSelect.val() !== "";
  isValid ? hideError(elements.ageErrorElement) : showInputError(elements.ageErrorElement, "Please select an age group.");
  return isValid;
}

function showError(errorMessageElement, message) {
  errorMessageElement.text(message).css('display', 'block');
}

function hideError(errorMessageElement) {
  errorMessageElement.css('display', 'none');
}

function showInputError(errorElement, errorMessage) {
  $(".error-tooltip", errorElement.parent()).text(errorMessage);
  errorElement.css('display', 'inline');
}


function showModal(tax) {
  const modal = $('#modal');
  const taxResult = $('#taxResult');
  taxResult.text( tax.toFixed(5) *10000);
  modal.css('display', 'block');
}

function closeModal() {
  $('#modal').css('display', 'none');
}
