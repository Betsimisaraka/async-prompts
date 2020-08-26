function wait(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function destroyPopup(popup) {
    popup.classList.remove('open');
    await wait(1000);
    //remove it from the dom
    popup.remove();
    //remove it from the javascript memory
    popup = null;
}

function ask(options) {
    //option object will have an atributes with the questions,and the option for a cancel button
    return new Promise(async function(resolve) {
        // First we need to create a popp with all the fields in it
        const popup = document.createElement('form');
        popup.classList.add('popup');
        popup.insertAdjacentHTML('afterbegin', 
        `
            <fieldset>
                <label>${options.title}</label>
                <input type="text" name="input">
                <button type="submit">Submit</button>
            </fieldset>
        `);

        //check if they want a cancel button
        if (options.cancel) {
            const skipButton = document.createElement('button');
            skipButton.type = "button";
            skipButton.textContent = 'Cancel';
            popup.firstElementChild.appendChild(skipButton);
            //listen for a click on that cancel button;
            skipButton.addEventListener(
                'click', 
                () => {
                    resolve(null);
                    destroyPopup(popup);
            },
                { once: true }
            );
        }
        //listen for the submit event on the inputs

        popup.addEventListener(
            'submit', 
            e => {
                e.preventDefault();
                //popup.input.value;
                resolve(e.target.input.value);
                destroyPopup(popup);
            }, 
            { once: true }
        );
        // when someone does submit it, resolve the data that was in the iput box.
        //insert that popup in the DOM
        document.body.appendChild(popup);
        await wait(50);
        popup.classList.add('open');
    });
}

async function askQuestion(e) {
    const button = e.currentTarget;
    const cancel = 'cancel' in button.dataset;
    //const cancel = button.hasAttribute('data-cancel');
    const answer = await ask({ 
        title: button.dataset.question,
        cancel,
    });
    console.log(answer);
}

const buttons = document.querySelectorAll('[data-question]');
buttons.forEach(buttons => buttons.addEventListener('click', askQuestion));

//****************

const questions = [
    { title: 'What is your name?🙂' },
    { title: 'What is your age?', cancel: true },
    { title: 'What is your dogs name?' },
];

async function asyncMap(array, callback) {
    const results = [];
    for (const item of array) {
        results.push(await callback(item));
    }
    return results;
}

async function go() {
    const answer = await asyncMap(questions, ask);
    console.log(answer);
}
go();