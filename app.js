const machineList = document.querySelector('#machine-list');

function renderMachines(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let queue_size = document.createElement('span');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    queue_size.textContent = doc.data().queue_size;

    li.appendChild(name);
    li.appendChild(queue_size);

    machineList.appendChild(li);
}

db.collection('machines').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        renderMachines(doc);
    })
})
