console.clear();

function updateBadge() {
    let counter = Number(document.cookie.split('counter=')[1]?.split(';')[0] || 0);
    document.getElementById("badge").innerHTML = counter;
    document.getElementById("totalItem").innerHTML = 'Total Items: ' + counter;
}

if (document.cookie.indexOf('counter=') >= 0) {
    updateBadge();
}

let cartContainer = document.getElementById('cartContainer');

let boxContainerDiv = document.createElement('div');
boxContainerDiv.id = 'boxContainer';

// DYNAMIC CODE TO SHOW THE SELECTED ITEMS IN YOUR CART
function dynamicCartSection(ob, itemCounter) {
    let boxDiv = document.createElement('div');
    boxDiv.id = 'box';
    boxContainerDiv.appendChild(boxDiv);

    let boxImg = document.createElement('img');
    boxImg.src = ob.preview;
    boxDiv.appendChild(boxImg);

    let boxh3 = document.createElement('h3');
    let h3Text = document.createTextNode(ob.name + ' × ' + itemCounter);
    boxh3.appendChild(h3Text);
    boxDiv.appendChild(boxh3);

    let boxh4 = document.createElement('h4');
    let h4Text = document.createTextNode('Amount: Rs ' + (ob.price * itemCounter));
    boxh4.appendChild(h4Text);
    boxDiv.appendChild(boxh4);

    // Add remove button
    let removeButton = document.createElement('button');
    removeButton.className = 'remove-button';
    removeButton.innerHTML = 'Remove';
    removeButton.onclick = function() {
        removeItem(ob.id, itemCounter, ob.price);
        boxDiv.remove();
        updateBadge();
    };
    boxDiv.appendChild(removeButton);

    cartContainer.appendChild(boxContainerDiv);
    cartContainer.appendChild(totalContainerDiv);

    return cartContainer;
}

// Create and append 'total' section
let totalContainerDiv = document.createElement('div');
totalContainerDiv.id = 'totalContainer';

let totalDiv = document.createElement('div');
totalDiv.id = 'total';
totalContainerDiv.appendChild(totalDiv);

// TO UPDATE THE TOTAL AMOUNT
function amountUpdate(amount) {
    let totalh4 = document.createElement('h4');
    let totalh4Text = document.createTextNode(' Total Amount: Rs ' + amount);
    totalh4.id = 'toth4';
    totalh4.appendChild(totalh4Text);
    totalDiv.appendChild(totalh4);
    console.log(totalh4);
}

// Function to remove item from cart and update total amount
function removeItem(itemId, itemCounter, itemPrice) {
    let counter = Number(document.cookie.split('counter=')[1].split(';')[0]);
    counter -= itemCounter;
    document.cookie = `counter=${counter};path=/`;
    document.getElementById("badge").innerHTML = counter;
    document.getElementById("totalItem").innerHTML = 'Total Items: ' + counter;

    let totalAmount = Number(document.getElementById('toth4').innerText.split('Rs ')[1]);
    totalAmount -= itemPrice * itemCounter;
    document.getElementById('toth4').innerText = ' Total Amount: Rs ' + totalAmount;
    updateBadge();
}

let buttonDiv = document.createElement('div');
buttonDiv.id = 'button';

let buttonTag = document.createElement('button');
buttonDiv.appendChild(buttonTag);

let buttonText = document.createTextNode('Checkout');
buttonTag.appendChild(buttonText);
buttonTag.onclick = function() { 
    console.log("clicked");

    // Store order details in localStorage
    let orderDetails = [];
    let items = document.querySelectorAll('#boxContainer #box');
    items.forEach(item => {
        let name = item.querySelector('h3').innerText.split(' × ')[0];
        let quantity = item.querySelector('h3').innerText.split(' × ')[1];
        let price = item.querySelector('h4').innerText.split('Rs ')[1];
        orderDetails.push({ name, quantity, price });
    });
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));

    // Redirect to order summary page
    window.location.href = 'orderSummary.html';
    document.cookie = "counter=0;path=/"; // Reset counter cookie
    updateBadge();
};

totalContainerDiv.appendChild(buttonDiv); // Append the buttonDiv to totalContainerDiv

// BACKEND CALL
let httpRequest = new XMLHttpRequest();
let totalAmount = 0;
httpRequest.onreadystatechange = function() {
    if (this.readyState === 4 && this.status == 200) {
        contentTitle = JSON.parse(this.responseText);

        let counter = Number(document.cookie.split('counter=')[1].split(';')[0]);
        document.getElementById("totalItem").innerHTML = 'Total Items: ' + counter;

        if (document.cookie.indexOf('orderId=') >= 0) {
            let orderIdCookie = document.cookie.split('orderId=')[1].split(';')[0].trim();
            if (orderIdCookie) {
                let item = orderIdCookie.split(" ");
                console.log(counter);
                console.log(item);

                let i;
                let totalAmount = 0;
                for (i = 0; i < counter; i++) {
                    let itemCounter = 1;
                    for (let j = i + 1; j < counter; j++) {
                        if (Number(item[j]) == Number(item[i])) {
                            itemCounter += 1;
                        }
                    }
                    let productIndex = Number(item[i]) - 1;
                    if (!isNaN(productIndex) && contentTitle[productIndex]) {  // Ensure the index is valid
                        totalAmount += Number(contentTitle[productIndex].price) * itemCounter;
                        dynamicCartSection(contentTitle[productIndex], itemCounter);
                    } else {
                        console.error(`Product with index ${productIndex} not found in contentTitle`);
                    }
                    i += (itemCounter - 1);
                }
                amountUpdate(totalAmount);
            } else {
                console.error('orderIdCookie is empty or invalid');
            }
        } else {
            console.error('orderId cookie not found');
        }
    } else {
        console.log('call failed!');
    }
};

httpRequest.open('GET', 'https://5d76bf96515d1a0014085cf9.mockapi.io/product', true);
httpRequest.send();




