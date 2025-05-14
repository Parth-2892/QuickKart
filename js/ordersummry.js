// Description: JavaScript file for Order Summary page.

function updateBadge() {
    let counter = Number(document.cookie.split('counter=')[1]?.split(';')[0] || 0);
    if (counter === 0) {
        const cartItems = JSON.parse(localStorage.getItem('orderDetails')) || [];
        counter = cartItems.length;
    }
    document.getElementById("badge").innerHTML = counter;
}

// Fetch order details from localStorage
const orderDetails = JSON.parse(localStorage.getItem('orderDetails'));
let totalAmount = 0;

if (orderDetails) {
    const orderDetailsContainer = document.getElementById('orderDetails');
    orderDetails.forEach(item => {
        const orderItemDiv = document.createElement('div');
        orderItemDiv.className = 'order-item';
        orderItemDiv.innerHTML = `
            <h2>${item.name}</h2>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: Rs ${parseFloat(item.price).toFixed(2)}</p>
        `;
        orderDetailsContainer.appendChild(orderItemDiv);
        totalAmount += item.quantity * parseFloat(item.price);
    });

    // Display total amount
    document.getElementById('orderTotal').innerText = `Total Amount: Rs ${totalAmount.toFixed(2)}`;
}

// Fetch user data from localStorage
const user = JSON.parse(localStorage.getItem('user'));
if (user) {
    document.getElementById('name').innerText = `Firstname: ${user.name.firstname} 
    Lastname: ${user.name.lastname}`;
    document.getElementById('email').innerText = `Email: ${user.email}`;
    document.getElementById('phone').innerText = `Phone: ${user.phone}`;
    document.getElementById('address').innerText = `Address: ${user.address.number} ${user.address.street}, ${user.address.city}, ${user.address.zipcode}`;
}

// Place Order button functionality
document.getElementById('placeorderButton').addEventListener('click', function() {
    // Reset counter cookie
    document.cookie = "counter=0;path=/";
    updateBadge();
    // Redirect to order placed page
    window.location.href = 'orderPlaced.html';
});

updateBadge(); // Update badge on page load