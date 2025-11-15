
/**
 * app.js
 * Final Combined JavaScript for Blood Donor App.
 * Uses localStorage for dummy data storage and robust number linking.
 */

// --- 1. Utility Functions: Data Storage (localStorage) ---

// Loads donor data from browser's local storage
function getDonors() {
    const donors = localStorage.getItem('bloodDonors');
    return donors ? JSON.parse(donors) : [];
}

// Saves donor data to browser's local storage
function saveDonors(donors) {
    localStorage.setItem('bloodDonors', JSON.stringify(donors));
}

// Cleans phone number by removing non-digit characters
function cleanPhoneNumber(number) {
    return number ? number.toString().replace(/[^0-9]/g, '') : '';
}

// --- 2. Register Functionality (`register.html` logic) ---

// Copies Contact Number to WhatsApp Number field
function copyContact() {
    const contactNum = document.getElementById('contact_num');
    const whatsappNum = document.getElementById('whatsapp_num');
    const checkbox = document.getElementById('same_as_contact');

    if (checkbox.checked) {
        whatsappNum.value = contactNum.value;
        whatsappNum.readOnly = true;
    } else {
        whatsappNum.value = '';
        whatsappNum.readOnly = false;
    }
}

function handleRegistration(event) {
    event.preventDefault(); 

    const donorForm = document.getElementById('donorForm');
    if (!donorForm) return;

    const newDonor = {
        id: Date.now(), 
        district: document.getElementById('district_reg').value,
        blood_group: document.getElementById('bloodgroup_reg').value,
        name: document.getElementById('name').value,
        // Clean and save numbers
        contact_number: cleanPhoneNumber(document.getElementById('contact_num').value),
        whatsapp_number: cleanPhoneNumber(document.getElementById('whatsapp_num').value),
        pincode: document.getElementById('pincode_reg').value
    };

    const donors = getDonors();
    donors.push(newDonor);
    saveDonors(donors);

    alert('Registration successful! Donor data saved locally in your browser.');
    donorForm.reset(); 
}

// --- 3. Find Donor Functionality (`find.html` logic) ---

function handleFindDonors(event) {
    if (event) {
        event.preventDefault();
    }

    const district = document.getElementById('district_find').value;
    const blood_group = document.getElementById('bloodgroup_find').value;
    const pincode = document.getElementById('pincode_find').value;
    const resultsContainer = document.getElementById('results');
    
    resultsContainer.innerHTML = '<p class="no-results">Searching locally...</p>'; 

    const allDonors = getDonors();

    const filteredDonors = allDonors.filter(donor => {
        return (
            donor.district === district &&
            donor.blood_group === blood_group &&
            donor.pincode === pincode
        );
    });

    displayResults(filteredDonors, resultsContainer);
}

// Function to display results in the HTML with ONLY number visibility
function displayResults(donors, container) {
    container.innerHTML = ''; 

    if (donors.length > 0) {
        let html = '<h3>Found Donors:</h3>';
        
        donors.forEach(donor => {
            
            // फ़ोन लिंक बनाया गया है, लेकिन इसका उपयोग केवल नंबर डिस्प्ले को क्लिकेबल बनाने के लिए हो सकता है
            const phoneLink = `tel:+91${donor.contact_number.slice(-10)}`; 
            
            html += `
                <div class="donor-card">
                    <p><strong>Name:</strong> ${donor.name}</p>
                    <p><strong>Blood Group:</strong> <span class="blood-group-tag">${donor.blood_group}</span></p>
                    <p><strong>District:</strong> ${donor.district}</p>
                    
                    <div class="contact-display">
                        <p>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Phone_iOS.png" alt="Phone" class="icon-small"> 
                            <strong>Call:</strong> 
                            <a href="${phoneLink}" style="text-decoration: none; color: inherit; font-weight: 400;">
                                ${donor.contact_number}
                            </a>
                        </p>
                        <p>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" class="icon-small">
                            <strong>WhatsApp:</strong> ${donor.whatsapp_number}
                            </p>
                    </div>
                    </div>
            `;
        });
        container.innerHTML = html;
    } else {
        container.innerHTML = '<p class="no-results">No donors found matching your exact criteria locally. Please try a different combination.</p>';
    }
}

// --- 4. Event Listeners Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // Expose copyContact globally for onclick attribute in register.html
    window.copyContact = copyContact; 

    // Attach listener for Register Form
    const donorForm = document.getElementById('donorForm');
    if (donorForm) {
        donorForm.addEventListener('submit', handleRegistration);
    }

    // Attach listener for Find Form
    const findForm = document.getElementById('findForm');
    if (findForm) {
        findForm.addEventListener('submit', handleFindDonors);
    }
});
