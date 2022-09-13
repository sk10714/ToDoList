"use strict";

var section = document.querySelector("section");
var add = document.querySelector("form button");
add.addEventListener("click", function (e) {
  e.preventDefault();
  var form = e.target.parentElement;
  var todoText = form.children[0].value;
  var todoMonth = form.children[1].value;
  var todoDate = form.children[2].value;

  if (todoText === "") {
    alert("Please Enter some Text.");
    return;
  }

  var todo = document.createElement("div");
  todo.classList.add("todo");
  var text = document.createElement("p");
  text.classList.add("todo-text");
  text.innerText = todoText;
  var time = document.createElement("p");
  time.classList.add("todo-time");
  time.innerText = todoMonth + " / " + todoDate;
  todo.appendChild(text);
  todo.appendChild(time);
  var completeButton = document.createElement("button");
  completeButton.classList.add("complete");
  completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
  completeButton.addEventListener('click', function (e) {
    var todoItem = e.target.parentElement;
    todoItem.classList.toggle("done");
  });
  var trashButton = document.createElement("button");
  trashButton.classList.add("trash");
  trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
  trashButton.addEventListener("click", function (e) {
    var todoItem = e.target.parentElement;
    todoItem.addEventListener("animationend", function () {
      //remove from Local storage
      var text = todoItem.children[0].innerText;
      var myListArray = JSON.parse(localStorage.getItem("list"));
      myListArray.forEach(function (item, index) {
        if (item.todoText == text) {
          myListArray.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(myListArray));
        }
      });
      todoItem.remove();
    });
    todoItem.style.animation = "scaleDown 0.3s forwards";
  });
  todo.appendChild(completeButton);
  todo.appendChild(trashButton);
  todo.style.animation = "scaleUp 0.3s forwards"; //create an object

  var myTodo = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDate: todoDate
  }; //store data into an array of objects

  var myList = localStorage.getItem("list");

  if (myList == null) {
    localStorage.setItem("list", JSON.stringify([myTodo]));
  } else {
    var myListArray = JSON.parse(myList);
    myListArray.push(myTodo);
    localStorage.setItem("list", JSON.stringify(myListArray));
  }

  console.log(JSON.parse(localStorage.getItem("list")));
  form.children[0].value = ""; //clear the text input

  section.appendChild(todo);
});
loadData();

function loadData() {
  var myList = localStorage.getItem("list");

  if (myList !== null) {
    var myListArray = JSON.parse(myList);
    myListArray.forEach(function (item) {
      //create a todo
      var todo = document.createElement("div");
      todo.classList.add("todo");
      var text = document.createElement("p");
      text.classList.add("todo-text");
      text.innerText = item.todoText;
      var time = document.createElement("p");
      time.classList.add("todo-time");
      time.innerText = item.todoMonth + " / " + item.todoDate;
      todo.appendChild(text);
      todo.appendChild(time); //create green check and red trash can

      var completeButton = document.createElement("button");
      completeButton.classList.add("complete");
      completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
      completeButton.addEventListener('click', function (e) {
        var todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
      });
      var trashButton = document.createElement("button");
      trashButton.classList.add("trash");
      trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      trashButton.addEventListener("click", function (e) {
        var todoItem = e.target.parentElement;
        todoItem.addEventListener("animationend", function () {
          //remove from Local storage
          var text = todoItem.children[0].innerText;
          var myListArray = JSON.parse(localStorage.getItem("list"));
          myListArray.forEach(function (item, index) {
            if (item.todoText == text) {
              myListArray.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(myListArray));
            }
          });
          todoItem.remove();
        });
        todoItem.style.animation = "scaleDown 0.3s forwards";
      });
      todo.appendChild(completeButton);
      todo.appendChild(trashButton);
      section.appendChild(todo);
    });
  }
}

function mergeTime(arr1, arr2) {
  var result = [];
  var i = 0;
  var j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }

  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    var middle = Math.floor(arr.length / 2);
    var right = arr.slice(0, middle);
    var left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

var sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", function () {
  //sort data
  var sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedArray)); //remove data

  var len = section.children.length;

  for (var i = 0; i < len; i++) {
    section.children[0].remove();
  } //load data


  loadData();
});