const loginFormHandler = async (event) => {
  event.preventDefault();

  // Collect values from the login form and trims any excess spaces off
  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (email && password) {//makes sure both values are present
    // Send a POST request to the API endpoint
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ //turns the json values into a string form
        email,
        password,
      }),
      headers: {
        'Content-Type': 'application/json', //verifies the value type of data sent
      },
    });

    if (response.ok) {
      // If login is correct, redirect the browser to the dashboard page
      document.location.replace('/dashboard');  
    } else {
      alert('Failed to log in. ');
    }
  }
};

const signupFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#username-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  if (name && email && password) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/dashboard');//if signup is successful redirects to dash
    } else {
      alert('Failed to sign up. Oh crud.');
    }
  }
};

document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);

document
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler);
