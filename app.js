
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

        

        // gets the FIREBASE id of the machine that is clicked
        let id = evnt.target.parentElement.getAttribute('data-id'); 
        
        // store the specific machine from FIREBASE
        const machine_to_be_updated = db.collection('machines').doc(id);

        // async function to incremement the queue size
        machine_to_be_updated.get().then((doc)=>{
            new_size = doc.data().queue_size + 1;

            db.collection('machines').doc(id).update({
                name: doc.data().name,
                queue_size: new_size
            }); // updates the data stored in the FIREBASE database
        });

        //console.log(doc.data());
        
        
    }) 
}


// real time listener

db.collection('machines').orderBy('name', 'asc').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == "added"){
            // renders all the machines intially
            renderMachines(change.doc);
        }
        else if (change.type == "modified"){
            // selects the list element
            let li = machineList.querySelector('[data-id=' + change.doc.id + ']');
            // childNodes[1] represents the queue_size span element
            // this code updates that span element to reflect the new queue size
            li.childNodes[1].innerHTML = change.doc.data().queue_size;
            
        }
        else if (change.type == "removed"){
            // probably wont be used...
            // store the li element according to that data id that is removed
            let li = machineList.querySelector('[data-id=' + change.doc.id + ']');
            machineList.removeChild(li);
        }
    });

})

auth.classList.add('hide');
//main.classList.add('hide');
