
const machineList = document.querySelector('#machine-list'); // store the DOM
const main = document.querySelector('.main');
const auth = document.querySelector('.auth');
const queue_screen = document.querySelector('.queue-screen');
const claim_page = document.querySelector('.claim_page');
const uid_map = new Map();
uid_map.set('SS7scvBhrRY0rSJezqnkNVCN08g2', 'Emil');
uid_map.set('KRXk7oQiUfVrrBW1TVrjKsVJKoe2', "AJ");
uid_map.set('MQ7KhOBV5UaXw7qDu6SWRd9EwLJ3', "Adil");
// initial hides
main.classList.add('hide');
queue_screen.classList.add('hide');
claim_page.classList.add('hide');

// get the enter button on the auth screen
let enter_button = auth.querySelector(".landing #enter");

// add event handler to "enter button" to 'hide' the auth screen
// and to 'show' the main screen on click
enter_button.addEventListener('click', (evnt) =>
{
    firebase.auth().signInAnonymously().then(()=>{

    }).catch((error)=>{
        console.log(error.code, error.message);
    });

    auth.classList.add('hide');
    main.classList.remove('hide');
});

let uid;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    uid = user.uid;

    let main_page_listener;

    main_page_listener = db.collection('machines').orderBy('name', 'asc').onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if(change.type == "added"){
                // renders all the machines intially
                renderMachines(change.doc);
            }
            else if (change.type == "modified"){
                // selects the modified list element
                let li = machineList.querySelector('[data-id=' + change.doc.id + ']');
                // li.style.backgroundColor = 'blue';
                // li.style.color = 'red';
                
                // childNodes[1] represents the queue_size span element
                // this code updates that span element to reflect the new queue size
    
                //chosen_machine_id = li.getAttribute("data-id"); // get the chosen machine id
                //console.log(chosen_machine_id);
                //li.style.background = "url('Machine1.jpg')";
                //document.querySelector("machine-list").style.background ="url('Machine1.jpeg')"; 

                
                //renderMachines(change.doc);
                renderQueue(change.doc, uid);
                li.childNodes[1].innerHTML = "People in queue: " + (change.doc.data().names.length - 1);;

            }
            else if (change.type == "removed"){
                // probably wont be used...
                // store the li element according to that data id that is removed
                let li = machineList.querySelector('[data-id=' + change.doc.id + ']');
                machineList.removeChild(li);
            }
        });
    
    });
    
    


    
  } else {

  }
});

function renderMachines(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let queue_size = document.createElement('span');
    let add_button = document.createElement('div'); // create the 'join' button
    add_button.classList.add('joinQueue');

    // set the list items' "data-id" attribute to its corresponding id from FIREBASE
    li.setAttribute('data-id', doc.id);

    // intialize the text content of the list item
    name.textContent = doc.data().name;
    queue_size.textContent = "People in queue: " + (doc.data().names.length - 1);
    add_button.textContent = "Join this queue";

    // append the items to the list item
    li.appendChild(name);
    li.appendChild(queue_size);
    li.appendChild(document.createElement('br'));
    li.appendChild(add_button);

    // append the list to the DOM
    machineList.appendChild(li);


    // add event listener to the "join queue" buttons so that they have functionality
    add_button.addEventListener('click', (evnt) => {
        evnt.stopPropagation(); // stops the default action
        //console.log("addBUTTO!!!!");
        // gets the FIREBASE id of the machine that is clicked
        let id = evnt.target.parentElement.getAttribute('data-id'); 
        //console.log(id);
        // store the specific machine from FIREBASE
        const machine = db.collection('machines').doc(id);

        // async function to update the queue.
        db.collection('machines').doc(id).update({
            name: doc.data().name,
            names: firebase.firestore.FieldValue.arrayUnion(uid),
            queue_size: doc.data().names.length
        }); // updates the data stored in the FIREBASE database 
        

        // once clicked, the page will redirect
        main.classList.add('hide');
        queue_screen.classList.remove('hide');
        
    });

}

async function sendSMS() {
    try {
        const response = await axios.post('http://localhost:3001/sendsms', {
            phonenumber: "+12404724142",
            textmessage: "Waitless - Your machine is ready!"
        });

        console.log(response);

    } catch (err) {
        console.log(err);
    }
}


// real time listener

function renderQueue(doc, user)
{
    // logic for rendering the screen initially

    let queue_screen_element = document.getElementById("current_machine_name"); 
    queue_screen_element.innerHTML = doc.data().name;

    let pos = document.getElementById("position");
    pos.innerHTML = "You are "+ (doc.data().names.length-1) + " in line!";
    let data = doc.data();
    let row ="";
    for(var i =1; i < data.names.length; i++)
         row += `<tr><td>${i}</td><td>${uid_map.get(data.names[i])}</td></tr>`;
    
    let table = document.getElementById("myTable");
    queue_screen_element.setAttribute('data-id', doc.id);
    table.innerHTML = row;
    
    leave_queue_id = document.getElementById("leave_queue_id");
    leave_queue_id.addEventListener('click', (event)=>{

        event.stopPropagation();
        
        db.collection('machines').doc(doc.id).update({
            name: doc.data().name,
            names: firebase.firestore.FieldValue.arrayRemove(uid),
            queue_size: doc.data().names.length -1
        }); // updates the data stored in the FIREBASE database

        main.classList.remove('hide');
        queue_screen.classList.add('hide');

        
    });

    let claim_buttom = document.getElementById("claim_machine_button");
    claim_buttom.addEventListener('click', (event) =>{
        event.stopPropagation();
        let machine_name = document.getElementById("current_machine_name");
        const machine = db.collection('machines').doc(machine_name.getAttribute('data-id'));
        db.collection('machines').doc(doc.id).update({
            name: doc.data().name,
            names: firebase.firestore.FieldValue.arrayRemove(uid),
            queue_size: (doc.data().names.length - 1)
        }); // updates the data stored in the FIREBASE database

        queue_screen.classList.add('hide');
        claim_page.classList.remove('hide');
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
         }

        sleep(10000).then(() =>{
            sendSMS();
            claim_page.classList.add('hide');

            auth.classList.remove('hide');
        });

    });

}
