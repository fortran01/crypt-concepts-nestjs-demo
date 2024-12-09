document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/crypto';
    let lastEncryptedData = '';

    // Show/hide work factor based on algorithm
    const hashAlgorithm = document.getElementById('hashAlgorithm');
    const workFactorGroup = document.getElementById('workFactorGroup');
    
    function updateWorkFactorVisibility() {
        const algorithm = hashAlgorithm.value;
        workFactorGroup.style.display = 
            (algorithm === 'bcrypt' || algorithm === 'argon2') ? 'block' : 'none';
    }
    
    // Update visibility on page load
    updateWorkFactorVisibility();
    // Update visibility when algorithm changes
    hashAlgorithm.addEventListener('change', updateWorkFactorVisibility);

    // Update work factor display
    const workFactor = document.getElementById('workFactor');
    const workFactorValue = document.getElementById('workFactorValue');
    workFactor.addEventListener('input', () => {
        workFactorValue.textContent = workFactor.value;
    });

    // Handle password hashing
    const hashForm = document.getElementById('hashForm');
    hashForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const password = document.getElementById('password').value;
        const algorithm = hashAlgorithm.value;
        const workFactorValue = parseInt(workFactor.value);

        const payload = {
            password,
            algorithm
        };

        // Only include workFactor for bcrypt and argon2
        if (algorithm === 'bcrypt' || algorithm === 'argon2') {
            payload.workFactor = workFactorValue;
        }

        try {
            const response = await fetch(`${API_URL}/hash`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            
            document.getElementById('saltValue').textContent = data.salt;
            document.getElementById('concatenationOrder').textContent = data.concatenation;
            document.getElementById('hashValue').textContent = data.hash;
            document.getElementById('hashTiming').textContent = `${data.timing_ms} ms`;
            document.getElementById('hashResults').style.display = 'block';
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while hashing the password.');
        }
    });

    // Handle encryption
    const encryptForm = document.getElementById('encryptForm');
    encryptForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const plaintext = document.getElementById('plaintext').value;

        try {
            const response = await fetch(`${API_URL}/encrypt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: plaintext }),
            });

            const data = await response.json();
            
            lastEncryptedData = data.encrypted_base64;
            document.getElementById('encryptedValue').textContent = lastEncryptedData;
            document.getElementById('encryptTiming').textContent = `${data.encryption_timing_ms} ms`;
            document.getElementById('encryptResults').style.display = 'block';
            document.getElementById('decryptResults').style.display = 'none';
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while encrypting the data.');
        }
    });

    // Handle decryption
    const decryptButton = document.getElementById('decryptButton');
    decryptButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`${API_URL}/decrypt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: lastEncryptedData }),
            });

            const data = await response.json();
            
            document.getElementById('decryptedValue').textContent = data.decrypted_data;
            document.getElementById('decryptTiming').textContent = `${data.decryption_timing_ms} ms`;
            document.getElementById('decryptResults').style.display = 'block';
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while decrypting the data.');
        }
    });
});
