const root = document.querySelector("#root");
let userAll = [];
let tbody = document.createElement("tbody");

fetch("https://jsonplaceholder.typicode.com/users")
  .then((response) => response.json())
  .then((json) => {
    userAll = json;
    users();
  });

function users() {
  let numId = 1;
  for (let i = 0; i < userAll.length; i++) {
    let tr = document.createElement("tr");

    let tdId = document.createElement("td");
    tdId.innerText = numId;
    numId++;

    let tdName = document.createElement("td");
    tdName.innerText = userAll[i].name;
    let tdPhone = document.createElement("td");
    tdPhone.innerText = userAll[i].phone;
    let tdCity = document.createElement("td");
    tdCity.innerText = userAll[i].website;
    let tdWebsite = document.createElement("td");
    tdWebsite.innerText = userAll[i].email;
    let tdAction = document.createElement("td");
    let edit = document.createElement("button");
    edit.innerText = "Edit";
    let remove = document.createElement("button");
    remove.innerText = "X";
    tdAction.append(edit, remove);

    tr.id = userAll[i].id;

    tr.append(tdId, tdName, tdPhone, tdCity, tdWebsite, tdAction);

    tbody.insertAdjacentElement("beforeend", tr);

    let table = document.querySelector("table");
    table.insertAdjacentElement("beforeend", tbody);

    // delete user func

    remove.addEventListener("click", (e) => {
      let id = e.target.parentElement.parentElement.id;

      userAll = userAll.filter((elem) => {
        return elem.id !== +id;
      });
      tbody.innerHTML = "";
      users();

      fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: "DELETE",
      }).then((data) => console.log("delete status", data.status));
    });

    //edit user func

    edit.addEventListener("click", (e) => {
      let editObj = {};
      let editArr = Array.from(e.target.parentElement.parentElement.childNodes);
      let editId = e.target.parentElement.parentElement.id;

      edit.hidden = true;
      let save = document.createElement("button");
      save.innerText = "Save";
      e.target.parentElement.insertAdjacentElement("afterbegin", save);

      editArr.forEach((elem, index, arr) => {
        let inp = document.createElement("input");
        if (index > 0 && index < arr.length - 1) {
          inp.value = arr[index].textContent;
          elem.textContent = "";
          inp.classList.add("editInput");
          inp.setAttribute("type", "text");
          inp.setAttribute("maxlength", "25");
          elem.appendChild(inp);
        }
      });

      ///  Save edit userinfo

      save.addEventListener("click", (e) => {
        edit.hidden = false;
        save.hidden = true;
        editArr.forEach((elem, index, arr) => {
          if (index > 0 && index < arr.length - 1) {
            elem.innerText = arr[index].childNodes[0].value;
          }
        });
        editObj["id"] = editId;
        editObj["name"] = editArr[1].childNodes[0].textContent;
        editObj["phone"] = editArr[2].childNodes[0].textContent;
        editObj["website"] = editArr[3].childNodes[0].textContent;
        editObj["email"] = editArr[4].childNodes[0].textContent;
        userAll.splice(+editId, 0, editObj);

        /// edit user info put

        fetch(`https://jsonplaceholder.typicode.com/users/${editId}`, {
          method: "PUT",
          body: JSON.stringify("editObj"),
        }).then((data) => console.log("put status", data.status));
        tbody.innerHTML = "";
        users();
      });
    });
  }
}

//Add function

let addButton = document.querySelector("#addButton");
let addDiv = document.querySelector(".addDiv");
let adder = false;
let form = document.querySelector("form");
let addDivCancel = document.querySelector(".addDivCancel");

// Open Close new user button func

addButton.addEventListener("click", () => {
  if (!adder) {
    addDiv.style.display = "block";
    adder = !adder;
  } else if (adder) {
    addDiv.style.display = "none";
    adder = !adder;
  }
});

// cancel new user div

addDivCancel.addEventListener("click", () => {
  addDiv.style.display = "none";
  adder = !adder;
});

// submit form func

const newUser = {};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addDiv.style.display = "none";
  adder = !adder;
  newUser["id"] = userAll.length;
  newUser["name"] = Array.from(form)[0].value;
  newUser["phone"] = Array.from(form)[1].value;
  newUser["website"] = Array.from(form)[2].value;
  newUser["email"] = Array.from(form)[3].value;
  userAll.push(newUser);

  console.log(userAll.length, userAll);

  fetch(`https://jsonplaceholder.typicode.com/users/`, {
    method: "POST",
    body: JSON.stringify("newUser"),
  }).then((data) => console.log("post status", data.status));
  tbody.innerHTML = "";
  users();
});
