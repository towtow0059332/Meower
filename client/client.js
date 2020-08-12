const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const API_URL = 'http://localhost:5000/mews'
const mewsElement = document.querySelector('div.mews');

listAllMews();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    const mew = {
        name,
        content
    };

    form.style.display = 'none';
    loadingElement.style.display = ''

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(mew),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => {
        console.log(response);
        response.json();
        console.log("response.json" + response);
    })
        .then(createdmew => {
            console.log(createdmew);
            form.reset();
            setTimeout(() => {
                form.style.display = '';
            }, 30000);
            listAllMews();
        });
});

function listAllMews() {
    mewsElement.innerHTML = '';
    fetch(API_URL)
        .then(response => response.json())
        .then(mews => {
            console.log(mews);
            mews.reverse();
            mews.forEach(mew => {
                const div = document.createElement('div');
                const header = document.createElement('h4');
                const contents = document.createElement('p');
                const date = document.createElement('small');

                div.className = 'u-full-width mew';
                header.className = 'mew-header';
                date.className = 'mew-date';

                header.textContent = mew.name;
                contents.textContent = mew.content;
                date.textContent = mew.created_date;

                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);


                mewsElement.appendChild(div);
            });
        });
    loadingElement.style.display = 'none';
}