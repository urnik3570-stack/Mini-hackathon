// CONFIGURATION: Replace these with your actual n8n Webhook URLs
const N8N_REGISTRATION_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/registration-id';
const N8N_SUPPORT_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/support-id';

// Hardcoded Build Timestamp (representing last changes made to files)
const LAST_UPDATED_TIME = "2026-07-08 22:00 UTC";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Last Updated Field
    document.querySelectorAll('.last-updated').forEach(el => el.textContent = LAST_UPDATED_TIME);

    // 2. Language Translation Switcher Engine
    let currentLang = 'en';
    const langToggleBtn = document.getElementById('lang-toggle');
    
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'hi' : 'en';
            langToggleBtn.textContent = currentLang === 'en' ? 'हिन्दी' : 'English';
            
            // Translate all elements with data attributes
            document.querySelectorAll('[data-en]').forEach(element => {
                element.textContent = element.getAttribute(`data-${currentLang}`);
            });
            // Translate placeholders dynamically
            document.querySelectorAll('input, textarea').forEach(element => {
                if(element.hasAttribute(`data-${currentLang}-placeholder`)) {
                    element.placeholder = element.getAttribute(`data-${currentLang}-placeholder`);
                }
            });
        });
    }

    // 3. Web Speech API (Voice Recognition) 
    const micButtons = document.querySelectorAll('.mic-btn');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        let activeTargetInput = null;

        micButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                activeTargetInput = document.getElementById(btn.getAttribute('data-target'));
                recognition.lang = currentLang === 'en' ? 'en-US' : 'hi-IN';
                
                if (btn.classList.contains('listening')) {
                    recognition.stop();
                } else {
                    btn.classList.add('listening');
                    recognition.start();
                }
            });
        });

        recognition.onend = () => {
            micButtons.forEach(btn => btn.classList.remove('listening'));
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (activeTargetInput) {
                activeTargetInput.value += (activeTargetInput.value ? ' ' : '') + transcript;
            }
        };
    } else {
        // Hide Mic capabilities if browser does not support Web Speech API
        micButtons.forEach(btn => btn.style.display = 'none');
        console.warn("Speech recognition not supported in this browser.");
    }

    // 4. Automated Suggestion Click Handler (Support Page Only)
    document.querySelectorAll('.tag-btn').forEach(button => {
        button.addEventListener('click', () => {
            const queryTextarea = document.getElementById('query');
            if (queryTextarea) {
                queryTextarea.value = button.getAttribute(`data-${currentLang}`);
            }
        });
    });

    // 5. Handling Form Submission to n8n Webhooks
    const regForm = document.getElementById('registrationForm');
    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                type: 'registration',
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                mobile: document.getElementById('mobile').value,
                skills: document.getElementById('skills').value,
                hackathonIdea: document.getElementById('idea').value,
                timestamp: new Date().toISOString()
            };
            await sendToN8N(N8N_REGISTRATION_WEBHOOK_URL, payload, regForm);
        });
    }

    const supportForm = document.getElementById('supportForm');
    if (supportForm) {
        supportForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                type: 'support_query',
                email: document.getElementById('supportEmail').value,
                query: document.getElementById('query').value,
                timestamp: new Date().toISOString()
            };
            await sendToN8N(N8N_SUPPORT_WEBHOOK_URL, payload, supportForm);
        });
    }
});

// Helper function to send data via POST fetch requests
async function sendToN8N(url, data, formElement) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Submitted successfully!');
            formElement.reset();
        } else {
            alert('Submission failed. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting data:', error);
        alert('Network connection error. Failed to reach server.');
    }
}