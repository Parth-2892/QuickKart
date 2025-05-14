// ...existing code...

function logout() {
    // Clear cart data when a user logs out
    clearCartData();

    // ...existing code to handle logout...
}

// Function to clear cart data
function clearCartData() {
    document.cookie = "counter=0;path=/";
    document.cookie = "orderId=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    localStorage.removeItem('cartItems');
}

// ...existing code...