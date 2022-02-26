const machineList = document.querySelector('#machine-list');
const main = document.querySelector('.main')
const auth = document.querySelector('.auth')

function renderMachines(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let queue_size = document.createElement('span');
    let add_button = document.createElement('div'); // create the 'join' button

    // set the list items' "data-id" attribute to its corresponding id from FIREBASE
    li.setAttribute('data-id', doc.id);

    // intialize the text content of the list item
    name.textContent = doc.data().name;
    queue_size.textContent = doc.data().queue_size;
    add_button.textContent = "Join this queue";

    // append the items to the list item
    li.appendChild(name);
    li.appendChild(queue_size);
    li.appendChild(add_button);

    // append the list to the DOM
    machineList.appendChild(li);


    // add event listener to the add buttons so that they have functionality
    add_button.addEventListener('click', (evnt) => {
        evnt.stopPropagation(); // stops the default action
        let id = evnt.target.parentElement.getAttribute('data-id'); // gets the FIREBASE id of the machine that is clicked
        
        db.collection('machines').doc(id).set({
            name: doc.data().name,
            queue_size: (doc.data().queue_size + 1)
        }); // updates the data stored in the FIREBASE database
    })
}

db.collection('machines').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        renderMachines(doc);
    })
})

main.classList.add('hide');
