let token = 'ezublin';

firebase.auth().signInWithEmailAndPassword('ejzublin@gmail.com', 'a212sdf')
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    console.log(user.email);
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("ERROR!!!!!!!!!!!!!!", errorCode, errorMessage);
  });

const machineList = document.querySelector('#machine-list'); // store the DOM
const main = document.querySelector('.main');
const auth = document.querySelector('.auth');
const queue_screen = document.querySelector('.queue-screen');

// initial hides
main.classList.add('hide');
queue_screen.classList.add('hide');

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
                // childNodes[1] represents the queue_size span element
                // this code updates that span element to reflect the new queue size
                li.childNodes[1].innerHTML = change.doc.data().queue_size;
    
                chosen_machine_id = li.getAttribute("data-id"); // get the chosen machine id
                //console.log(chosen_machine_id);
                
                
                renderQueue(change.doc, uid);
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


    // add event listener to the "join queue" buttons so that they have functionality
    add_button.addEventListener('click', (evnt) => {
        evnt.stopPropagation(); // stops the default action

        // gets the FIREBASE id of the machine that is clicked
        let id = evnt.target.parentElement.getAttribute('data-id'); 
        
        // store the specific machine from FIREBASE
        const machine = db.collection('machines').doc(id);

        // async function to update the queue.
        machine.get().then((doc)=>{

            // get the length of the array that represents the queue
            queue_len = doc.data().names.length;

            // prompt user for their UCInetID
            let ucinetid = prompt("Enter your UCInetID");

            if (ucinetid != null)
            {
                db.collection('machines').doc(id).update({
                    name: doc.data().name,
                    names: firebase.firestore.FieldValue.arrayUnion(ucinetid),
                    queue_size: queue_len
                }); // updates the data stored in the FIREBASE database 
            
            
                main.classList.add('hide');
                queue_screen.classList.remove('hide');
        
            }

            
            });

        // once clicked, the page will redirect
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
    let ucinetid = doc.data().names[doc.data().names.length-1];

    // logic for rendering the screen initially

    let queue_screen_element = document.getElementById("current_machine_name");
    queue_screen_element.innerHTML = doc.data().name;

    //console.log(ucinetid);
    let data = doc.data();
    let row ="";
    for(var i =1; i < data.names.length; i++)
         row += `<tr><td>${i}</td><td>${data.names[i]}</td></tr>`;
    
    let table = document.getElementById("myTable");
    table.innerHTML = row;
    
}


$(window).on("load resize ", function() {
    var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
    $('.tbl-header').css({'padding-right':scrollWidth});
  }).resize();


leave_queue_id.addEventListener('click', (event)=>{

    //console.log()
    
    let machine_name = document.getElementById("current_machine_name");
    const machine = db.collection('machines').doc(id);
    
//     machine.get().then((doc)=>{
        
//         var queue_update = doc.data().names.slice(0,-1);
        

//         db.collection('machines').doc(id).update({
//             names: queue_update,
//             queue_size: queue_size - 1
//         }); // updates the data stored in the FIREBASE database 
    
//         main.classList.remove('hide');
//       //  queue_screen.classList.remove('hide');

// });

    // async function to update the queue.
});
