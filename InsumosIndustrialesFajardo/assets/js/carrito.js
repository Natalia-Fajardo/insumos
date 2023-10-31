document.addEventListener("DOMContentLoaded", () => {
  let productsList = [];

  let car = [];
  const foreign = "$";
  const DOMitems = document.querySelector("#items");
  const DOMcar = document.querySelector("#carrito");
  const DOMtotal = document.querySelector("#total");
  const DOMbtnClean = document.querySelector("#boton-vaciar");
  const myLocalStorage = window.localStorage;

  function products() {
    fetch("https://dummyjson.com/products")
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        init(json.products);
      });
  }

  function init (productsList) {
    loadCarLocalStorage();
    renderProducts(productsList)
    renderCar(productsList);
  }

  function renderProducts(productsList) {
    productsList?.forEach((info) => {
      const myNode = document.createElement("div");
      myNode.classList.add("col-sm-4");
      const myNodeProduct = document.createElement("div");
      myNodeProduct.classList.add("product");
      const myNodeTitle = document.createElement("h3");
      myNodeTitle.textContent = info.title;
      const miNodoImagen = document.createElement("img");
      miNodoImagen.classList.add("img-fluid");
      miNodoImagen.setAttribute("src", info.images[0]);
      const myNodePrice = document.createElement("p");
      myNodePrice.textContent = `${info.price}${foreign}`;
      const myNodeBtnAdd = document.createElement("button");
      myNodeBtnAdd.classList.add("btn-primary");
      myNodeBtnAdd.textContent = "Agregar";
      myNodeBtnAdd.setAttribute("marcador", info.id);
      myNodeBtnAdd.addEventListener("click", (e) => addProduct(e, productsList));
      myNodeProduct.appendChild(miNodoImagen);
      myNodeProduct.appendChild(myNodeTitle);
      myNodeProduct.appendChild(myNodePrice);
      myNodeProduct.appendChild(myNodeBtnAdd);
      myNode.appendChild(myNodeProduct);
      DOMitems.appendChild(myNode);
    });
  }

  function addProduct(event, productsList) {
    car.push(event.target.getAttribute("marcador"));
    renderCar(productsList);
    saveCarLocalStorage();
  }

  function renderCar(productsList) {
    DOMcar.textContent = "";
    const carWithoutDuplicates = [...new Set(car)];
    carWithoutDuplicates?.forEach((item) => {
      const myProduct = productsList.filter((itemBD) => {
        return itemBD.id === parseInt(item);
      });
      const itemsUnit = car.reduce((total, itemId) => {
        return itemId === item ? (total += 1) : total;
      }, 0);
      const myNode = document.createElement("li");
      myNode.textContent = `${foreign}${itemsUnit} x ${myProduct[0].title} - ${myProduct[0].price}`;
      const btnRemove = document.createElement("button");
      btnRemove.classList.add("btn-danger");
      btnRemove.textContent = "X";
      btnRemove.style.marginLeft = "1rem";
      btnRemove.dataset.item = item;
      btnRemove.addEventListener("click", (e) => removeItemCar(e, productsList));
      myNode.appendChild(btnRemove);
      DOMcar.appendChild(myNode);
    });
    DOMtotal.textContent = calculateTotal(productsList);
  }

  function removeItemCar(event, productsList) {
    const id = event.target.dataset.item;
    car = car.filter((carId) => {
      return carId !== id;
    });
    renderCar(productsList);
    saveCarLocalStorage();
  }

  function calculateTotal(productsList) {
    return car.reduce((total, item) => {
      const myProduct = productsList.filter((itemBD) => {
        return itemBD.id === parseInt(item);
      });
      return total + myProduct[0].price;
    }, 0);
  }

  function cleanCar(productsList) {
    car = [];
    renderCar(productsList);
    localStorage.clear();
  }

  function saveCarLocalStorage() {
    myLocalStorage.setItem("carrito", JSON.stringify(car));
  }

  function loadCarLocalStorage() {
    if (myLocalStorage.getItem("carrito") !== null) {
      car = JSON.parse(myLocalStorage.getItem("carrito"));
    }
  }

  DOMbtnClean.addEventListener("click", () => cleanCar(productsList));
  products()
});
