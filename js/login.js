// ...existing code...

function login(username, password) {
    // ...existing code to authenticate user...

    // Clear cart data when a new user logs in
    clearCartData();

    // ...existing code to handle successful login...
}

// Function to clear cart data
function clearCartData() {
    document.cookie = "counter=0;path=/";
    document.cookie = "orderId=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    localStorage.removeItem('cartItems');
}

// ...existing code...