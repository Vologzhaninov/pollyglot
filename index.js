import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify/+esm';
//import DOMPurify from 'dompurify';

const form = document.querySelector('form');
const userInput = document.getElementById('user-input');
const inputLabel = document.getElementById('input-label');
const fieldset = document.querySelector('fieldset');
const button = document.querySelector('button');
const API_URL = 'https://node-express-server-beql.onrender.com';
let language = '';
let isFirstRender = true;

form.addEventListener('submit', handleTranslate);

function setLoading(isLoading) {
    button.disabled = isLoading;
}

async function handleTranslate(event) {
    event.preventDefault();
    const data = new FormData(form);
    isFirstRender ? language = data.get('lang'): null;
    const userPrompt = userInput.value.trim();

    if (!userPrompt) return;

    setLoading(true);

    //console.log(userPrompt)
    //console.log(language)

    try {
        const response = await fetch (`${API_URL}/api/translate`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                language: language, 
                userPrompt: userPrompt})
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message)
        }

        //console.log(data);
        let safeHTML = DOMPurify.sanitize(data.translation);
        let outputHTML = 
        `<label for="user-output" class="hand-point">
            Your translation 👇
        </label>
        <textarea 
            id="user-output" 
            class="textarea"
            rows="4" 
            maxlength="100"
            disabled
        >${safeHTML}</textarea>`;
        if (isFirstRender) {
            inputLabel.textContent = "Original text 👇";
            fieldset.classList.add("output-fieldset");
            button.textContent = "Start Over";
        }
        fieldset.innerHTML = outputHTML;
        isFirstRender = false;
    } catch(error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
}