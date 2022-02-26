
const machineList = document.querySelector('#machine-list'); // store the DOM
//const machineList = document.querySelector('#machine-list');
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
        
        let new_size = db.collection('machines').doc(id).data();
        console.log(new_size);
        db.collection('machines').doc(id).set({
            name: doc.data().name,
            queue_size: queue_size + 1
        }); // updates the data stored in the FIREBASE database
    }) 
}

/*
db.collection('machines').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        renderMachines(doc);
    })
})
<<<<<<< HEAD
*/

// real time listener

db.collection('machines').orderBy('name', 'asc').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == "added"){
            renderMachines(change.doc);
        }
        else if (change.type == "modified"){
            // selects the list element
            let li = machineList.querySelector('[data-id=' + change.doc.id + ']');
            li.childNodes[1].innerHTML = change.doc.data().queue_size;
            
        }
        else if (change.type == "removed"){
            // store the li element according to that data id that is removed
            let li = machineList.querySelector('[data-id=' + change.doc.id + ']');
            machineList.removeChild(li);
        }
    });

})


main.classList.add('hide');
