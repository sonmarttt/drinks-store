document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    const frmRegistration = document.querySelector("#frmRegistration");
    if (frmRegistration) {
        frmRegistration.addEventListener('submit', validateForm);
    }
    
    // Add input event listeners to all input fields
    const inputs = document.querySelectorAll('.login-input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.add('filled');
            } else {
                this.classList.remove('filled');
            }
        });
        // Check initial state (in case of browser autofill)
        if (input.value.trim() !== '') {
            input.classList.add('filled');
        }
       
    });
    
    //check browser autofill inputs after a short delay
    setTimeout(checkForAutofill, 500);
}

function checkForAutofill() {
    const inputs = document.querySelectorAll('.login-input');
    inputs.forEach(input => {
        if (input.value.trim() !== '') {
            input.classList.add('filled');
            // Force background to be transparent
            input.style.backgroundColor = 'transparent';
        }
    });
}

function validateForm(event) {
    event.preventDefault();
    console.log("Validating the form...");
    
    const firstName = document.querySelector("#first-name")?.value.trim();
    const lastName = document.querySelector("#last-name")?.value.trim();
    const email = document.querySelector("#email")?.value.trim();
    const confirmEmail = document.querySelector("#confirm-email")?.value.trim();
    const password = document.querySelector("#password")?.value;
    const confirmPassword = document.querySelector("#confirm-password")?.value;
    const street = document.querySelector("#address")?.value.trim();
    const phone = document.querySelector("#phone")?.value.trim();
    const dateOfBirth = document.querySelector("#dob")?.value;
    const country = document.querySelector("#country")?.value;
    const region = document.querySelector("#region")?.value;
    const city = document.querySelector("#city")?.value.trim();
    const postalCode = document.querySelector("#postal-code")?.value.trim();
    
    if (!firstName || !lastName || !email || !confirmEmail || !password || !confirmPassword || !street || !phone || !dateOfBirth || !country || !region || !city || !postalCode) {
        alert("Please fill in all the required fields.");
        return false;
    }
    
    // Format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    const postalCodeRegex = /^[A-Z]\d[A-Z]\s\d[A-Z]\d$/;
    
    if (!emailRegex.test(email)) {
        alert("Invalid email format.");
        return false;
    }
    
    if (email !== confirmEmail) {
        alert("Emails do not match.");
        return false;
    }
    
    if (!passwordRegex.test(password)) {
        alert("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.");
        return false;
    }
    
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }
    if (!phoneRegex.test(phone)) {
        alert("Phone number must be in format: 123-456-7890");
        return false;
    }
    
    if (!postalCodeRegex.test(postalCode)) {
        alert("Postal code must be in format: A1A 1A1");
        return false;
    }
    
    alert("Form submitted successfully!", "success");
     // Clear the form
     const form = document.querySelector("#frmRegistration");
     form.reset();
 
     // Remove .filled class from all inputs
     const inputs = document.querySelectorAll('.login-input');
     inputs.forEach(input => {
         input.classList.remove('filled');
     });
    return true;
}


