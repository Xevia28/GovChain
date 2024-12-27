document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form'); // The form containing the submit buttons
    const submitFormButton = document.querySelector('#submitSingleUserButton'); // General form submission button
    const submitFileButton = document.querySelector('#submitUserButton'); // File-related submit button

    // Form elements
    const nameInput = form.querySelector('input[placeholder="name"]'); // Name input field
    const emailInput = form.querySelector('input[type="email"]'); // Email input field
    const walletAddressInput = form.querySelector('input[placeholder=""]'); // Wallet address input field
    const roleSelect = form.querySelector('select'); // Role select menu
    const checkboxInput = form.querySelector('.form-check-input'); // Checkbox for 'Active'

    // File input
    const fileInput = form.querySelector('#fileInput'); // File input element

    // Helper function to add error messages
    function addError(element, message) {
        element.classList.add('is-invalid'); // Add invalid styling
        const errorDiv = document.createElement('div'); // Create error message element
        errorDiv.className = 'invalid-feedback'; // Bootstrap class for invalid feedback
        errorDiv.textContent = message; // Set error message text

        const parent = element.parentElement; // Parent element
        const existingErrorDiv = parent.querySelector('.invalid-feedback'); // Check if there's already an error

        if (!existingErrorDiv) {
            parent.appendChild(errorDiv); // Add new error message
        } else {
            existingErrorDiv.textContent = message; // Update existing error message
        }
    }

    // Helper function to clear all errors
    function clearErrors() {
        const invalidElements = form.querySelectorAll('.is-invalid'); // Find all invalid elements
        invalidElements.forEach(function (element) {
            element.classList.remove('is-invalid'); // Remove invalid class
            const errorDiv = element.parentElement.querySelector('.invalid-feedback');
            if (errorDiv) {
                errorDiv.remove(); // Remove existing error messages
            }
        });
    }

    // Function to validate Ethereum wallet address
    function validateWalletAddress(walletAddress) {
        const ethers = require('ethers');
        return ethers.utils.isAddress(walletAddress); // Validate structure and checksum
    }

    // Function to validate email
    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email regex pattern
        return emailPattern.test(email); // Return true if valid
    }

    // Event listener for general form submission
    submitFormButton.addEventListener('click', function () {
        clearErrors(); // Clear previous errors
        let isValid = true;

        // Validate name length
        if (nameInput.value.trim().length < 5) { // Check if length is less than 5
            addError(nameInput, 'Name must be at least 5 characters long.'); // Show error
            isValid = false; // Mark as invalid
        }

        // Validate email
        if (!validateEmail(emailInput.value.trim())) {
            addError(emailInput, 'Please enter a valid email address.'); // Show error
            isValid = false; // Mark as invalid
        }

        // Validate wallet address
        // if (walletAddressInput.value.trim() === '') {
        //     addError(walletAddressInput, 'Wallet address is required.'); // Show error
        //     isValid = false; // Mark as invalid
        // } else if (!validateWalletAddress(walletAddressInput.value.trim())) {
        //     addError(walletAddressInput, 'Please enter a valid Ethereum wallet address.'); // Show error
        //     isValid = false; // Mark as invalid
        // }

        // Validate role selection
        if (roleSelect.value === 'Open this select menu') {
            addError(roleSelect, 'Please select a role.'); // Show error
            isValid = false; // Mark as invalid
        }

        if (isValid) { // Submit the form only if all validations pass
            const userData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                walletAddress: walletAddressInput.value.trim(),
                role: roleSelect.value,
                isActive: checkboxInput.checked,
            };

            fetch('http://localhost:3000/api/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert("Success")
                // Handle success - e.g., show a success message, redirect, etc.
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle error - e.g., show an error message
            });
        }
    });

  
});
