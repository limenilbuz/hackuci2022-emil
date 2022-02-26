function Queue() {
    this.elements = [];
  }
  Queue.prototype.enqueue = function (e) {
    this.elements.push(e);
  };
  Queue.prototype.dequeue = function () {
      return this.elements.shift();
  };
  Queue.prototype.isEmpty = function () {
      return this.elements.length == 0;
  };
  Queue.prototype.peek = function () {
      return !this.isEmpty() ? this.elements[0] : undefined;
  };
  Queue.prototype.length = function () {
    return this.elements.length;
  };
  let q = new Queue();
  for (let i = 1; i <= 7; i++) {
    q.enqueue(i);
  }
  // get the current item at the front of the queue
  console.log(q.peek()); // 1
  
  // get the current length of queue
  console.log(q.length()); // 7
  
  // dequeue all elements
  while (!q.isEmpty()) {
      console.log(q.dequeue());
  }