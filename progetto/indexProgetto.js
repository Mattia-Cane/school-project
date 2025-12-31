"use strict";

//getting all the necessary elements
let lis = Icons.querySelectorAll("li");
let navBarA = navBarItems.querySelectorAll("a");
let chks = natDiv.querySelectorAll("input[type='checkbox']");
let btns = buttons.querySelectorAll("button");
let numberOfPages = buttons.querySelector("p");

//declaring user generation variables
let nationalities = [];
let gender = "all";
let numberOfUsers = 1;
let totalUsers = [];
let n1;
let currentPage = 0;
let pagesTotal;

//pages visualization inizialization
gnerateUser.style.display = "none";
tableVisualization.style.display = "none";

//#region Navbar click handling
for (let a of navBarA) {
  a.addEventListener("click", function () {
    for (let navA of navBarA) {
      navA.classList.remove("active");
    }
    this.classList.add("active");
    
    // Close navbar on mobile after clicking
    const navbarCollapse = document.getElementById("navbarScroll");
    if (navbarCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
      bsCollapse.hide();
    }
    
    if (this.textContent == "Home") {
      Home.style.display = "";
      gnerateUser.style.display = "none";
      tableVisualization.style.display = "none";
    } else if (this.textContent == "Genera utenti") {
      Home.style.display = "none";
      gnerateUser.style.display = "";
      tableVisualization.style.display = "none";
    } else if (this.textContent == "Table visualization") {
      Home.style.display = "none";
      gnerateUser.style.display = "none";
      tableVisualization.style.display = "";
    }
  });
}
//#endregion

//#region Fetch user data
let promise = ajax.sendRequest("GET", "/api");
promise.catch(ajax.errore);
promise.then(function (httpResponse) {
  let user = httpResponse.data.results[0];
  console.log(user);
  image.src = user.picture.large;

  for (let li of lis) {
    li.addEventListener("mouseleave", function () {
      this.classList.remove("active");
    });

    infoLabel.textContent =
      "My name is " + user.name.first + " " + user.name.last;
    li.addEventListener("mouseenter", function () {
      this.classList.add("active");
      infoLabel.textContent = "";
      if (this.id == "name") {
        infoLabel.textContent =
          "My name is " + user.name.first + " " + user.name.last;
      } else if (this.id == "mail") {
        infoLabel.textContent = "My email is " + user.email;
      } else if (this.id == "date") {
        infoLabel.textContent =
          "My birthday is " + user.dob.date.substring(0, 10);
      } else if (this.id == "location") {
        infoLabel.textContent =
          "My address is " +
          user.location.street.number +
          " " +
          user.location.street.name +
          ", " +
          user.location.city +
          ", " +
          user.location.country;
      } else if (this.id == "phone") {
        infoLabel.textContent = "My phone number is " + user.phone;
      } else if (this.id == "password") {
        infoLabel.textContent = "My password is " + user.login.password;
      }
    });
  }
});
//#endregion

//#region Range controls
rangeValue.textContent = userRange.value;

userRange.addEventListener("input", function () {
  rangeValue.textContent = this.value;
  if (this.value == 100) {
    moreUsers.style.display = "";
  }
});

moreUsersActivation.addEventListener("change", function () {
  if (this.checked) {
    userRange.max = 1000;
  } else if (userRange.value > 100) {
    userRange.max = 100;
    userRange.value = 100;
    rangeValue.textContent = userRange.value;
  } else {
    userRange.max = 100;
    rangeValue.textContent = userRange.value;
  }
});
//#endregion

//#region Radio Buttons controls
radioMale.addEventListener("change", function () {
  if (this.checked) {
    radioFemale.checked = false;
    radioAll.checked = false;
    gender = "male";
  }
});
radioFemale.addEventListener("change", function () {
  radioMale.checked = false;
  radioAll.checked = false;
  gender = "female";
});
radioAll.addEventListener("change", function () {
  radioMale.checked = false;
  radioFemale.checked = false;
  gender = "all";
});
//#endregion

//#region User Generation Button
btnGenerateUsers.addEventListener("click", function () {
  Home.style.display = "none";
  gnerateUser.style.display = "none";
  tableVisualization.style.display = "";

  for (let navA of navBarA) {
    navA.classList.remove("active");
  }
  navBarA[2].ariaDisabled = "false";
  navBarA[2].classList.remove("disabled");

  numberOfUsers = userRange.value;
  nationalities = [];
  for (let chk of chks) {
    if (chk.checked) {
      nationalities.push(chk.id.substring(3).toUpperCase());
    }
  }
  console.log("Number of users: " + numberOfUsers);
  console.log("Gender: " + gender);
  console.log("Nationalities: " + nationalities);

  let params = {
    results: parseInt(numberOfUsers),
    gender: gender,
    nationality: nationalities.join(","),
  };

  let promise = ajax.sendRequest("GET", "/api", params);
  promise.catch(ajax.errore);
  promise.then(function (httpResponse) {
    totalUsers = httpResponse.data.results;
    navBarA[2].classList.add("active");
    generaTableView();
  });
});

function generaTableView() {
  if (totalUsers.length < 10) {
    numberOfPages.textContent = "1 / 1";
  } else if (totalUsers.length % 10 == 0) {
    numberOfPages.textContent = "1 / " + parseInt(totalUsers.length / 10);
  } else {
    numberOfPages.textContent = "1 / " + (parseInt(totalUsers.length / 10) + 1);
  }

  pagesTotal = parseInt(numberOfPages.textContent.split("/")[1].trim());

  n1 =
    currentPage == lastPage()
      ? totalUsers.length % 10 == 0
        ? 10
        : totalUsers.length % 10
      : 10;

  userContainer.innerHTML = "";
  let row = document.createElement("div");
  row.classList.add("row", "gy-4", "gx-3");
  userContainer.appendChild(row);
  for (let i = currentPage * 10; i < currentPage * 10 + n1; i++) {
    let col = document.createElement("div");
    col.classList.add("col-12", "col-sm-6", "col-md-6", "col-lg-6", "mb-3");
    row.appendChild(col);

    let card = document.createElement("div");
    card.classList.add("card");
    col.appendChild(card);

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    card.appendChild(cardBody);

    let h5 = document.createElement("h5");
    h5.classList.add("card-title");
    h5.textContent = totalUsers[i].name.first + " " + totalUsers[i].name.last;
    cardBody.appendChild(h5);

    let p = document.createElement("p");
    p.classList.add("card-text");
    p.textContent = totalUsers[i].email;
    cardBody.appendChild(p);

    let a = document.createElement("a");
    a.href = "#";
    a.classList.add("btn", "btn-primary");
    a.textContent = "Mostra dettagli";
    a.addEventListener("click", mostraDettagli);
    cardBody.appendChild(a);

    addEventListener("click", function () {
      mostraDettagli(totalUsers[i]);
    });
  }
}

function lastPage() {
  return parseInt((totalUsers.length - 1) / 10);
}

Indietro.addEventListener("click", function () {
  if (currentPage <= 0) return;
  currentPage--;
  generaTableView();
  numberOfPages.textContent = currentPage + 1 + " / " + pagesTotal;
});

Avanti.addEventListener("click", function () {
  if (currentPage >= lastPage()) return;
  currentPage++;
  generaTableView();
  numberOfPages.textContent = currentPage + 1 + " / " + pagesTotal;
});

function mostraDettagli(user) {
  //to implemrmt
  
}
//#endregion
