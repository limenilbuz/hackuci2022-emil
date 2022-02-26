
var studentMap = new Map();
var equipmentMap = new Map();
var eachMachineMap = new Map();

for(var i =0; i < 10 ; i++)
{
    studentMap.set(i,i);
}

for(var i =0; i < 10 ; i++)
{
    equipmentMap.set(i+" eqipment",3);
}
for(var i =0; i < 10 ; i++)
{
    eachMachineMap.set(i+" eqipment",new Queue());
}

//pressed Tapped
tappedTheMachine(Element1 equipmentName, Element2 StudentName)
{
    var q = eachMachineMap.get(equipmentName);
    q.enqueue(StudentName);
    check(equipmentName);
}

check(var equipmentName)
{   
    var  c = eachMachineMap.get(equipmentName);
    if(c.size() <= equipmentMap.get(equipmentName))
    {
        //send to start machine function
        startMachine();
    }
}

startMachine()
{
    //change page
}

//pressed Stop
stoppedTheMachine(Element equipmentName)
{
    var queue = eachMachineMap.get(equipmentName);
    queue.dequeue();
    eachMachineMap.set(equipmentName,queue);

    //notify next person
    //call tapped
}

