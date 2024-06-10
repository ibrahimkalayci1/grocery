//* Düzenleme Seçenekleri
let editFlag = false; // düzenleme modunda olup olmdgnı belirtir
let editElement; // düzenleme yapılan öğeyi temsil eder
let editID = "" //düzenleme yapılan öğenin benzerswiz kimliği

//GEREKLİ HTML ELEMANLARINI ALMA
const form = document.querySelector(".grocery-form")/*form yapısını javaya aldık*/
console.log(form)
const grocery = document.getElementById("grocery")
const list = document.querySelector(".grocery-list");
const alert = document.querySelector(".alert")
const submitBtn = document.querySelector(".submit-btn");
const clearBtn = document.querySelector(".clear-btn");



//!Fonksiyonlar

//Ekrana bildirim bastıracak fonksiyondur
const displayAlert = (text,action) => {
alert.textContent = text // alert classlı etiketin içeriğini dışardan gönderilen parametre ile değiştirdik
alert.classList.add(`alert-${action}`) // p etiketine dinami class ekledik

setTimeout(()=>{
alert.textContent = "" //p etiketinin içerisini boş stringe çevirdik
alert.classList.remove(`alert-${action}`); //eklediğimiz class ı kaldırdık
},2000)

};

// varsayılan değerlere döndürür
const setBackToDefault = () => {
grocery.value = "";
editFlag = false;
editID = "";
submitBtn.textContent = "Ekle";
};



const addItem = (event) => // "e" yazsakta event olay demek
{
    event.preventDefault(); // formun gönderilmee olayında sayfanın yenilenmesini engelledi
   const value = grocery.value; // inputun  içine girilen değeri aldık 
    
   const id = new Date().getTime().toString(); // benzersiz bir id oluşturduk
   
   // eger inputun içiç boş değilse ve duzenle modunda değilse
   if(value !== "" && !editFlag){ // edit flag düzenleme modu demek ünlem olumsuz input kısmı boş değilse ve düzenleme modunda değilse
    const element = document.createElement("article") // Yeni bir article öğesi oluşturduk
    let attr = document.createAttribute("data-id"); //Yeni bir veri kimliği oluştur
    attr.value = id
    element.setAttributeNode(attr)// oluşturdugumuz id yi data özellik olarak set ettik
    element.classList.add("grocery-item");// article etiketine class ekledik
    element.innerHTML = `
    <p class="title">${value}</p>
    <div class="btn-container">
    <button type="button"
    class="edit-btn">
        <i class="fa-solid fa-pen-to-square"></i>
    </button>
    <button type="button" 
    class="delete-btn">
        <i class="fa-solid fa-trash"></i>   
    </button>
    </div>
    `;

    //*oluşturduğumuz bu butonlara olay izleyicileri ekleyebilmemiz için seçtik
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);// clicl olayı oldugunda delete metodu ekledik
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);
    list.appendChild(element); // oluşturduğumuz article etiketini htnl e ekledik
    displayAlert("Başarıyla Eklenildi", "success")

    setBackToDefault()
    addTolocalStorage(id, value)
    // varsayılan değerlere döndürecek me
    }else if(value !== ""&& editFlag) {
    editElement.innerHTML = value; // güncelleyecegimiz elemanın içeriğini değiştirdik
    displayAlert("Başarıyla Değiştirildi", "success");
    
    console.log(editID);
    editLocalStore(editID, value);
    setBackToDefault();
}
    
};

//silme butonuna tıklanıldığında çalışır
const deleteItem = (e) => {
const element = e.target.parentElement.parentElement.parentElement; //sileceğimiz elemana kapsayıcıları yaedımı ile ulaştık
const id = element.dataset.id
console.log(element);
list.removeChild(element); // bulduğumuz "article" etiketini list alanı içerisinden kaldırdı

displayAlert("Başarıyla Kaldırıldı", "danger"); // ekrana gönderdiğimiz parametrelere göre bildirim bastırır
removeFromLocalStorage(id)
};

const editItem = (e) =>{
    const element = (e.target.parentElement.parentElement.parentElement);
editElement = e.target.parentElement.parentElement.previousElementSibling; // düzenleme yapacagımız etiketi seçtik
grocery.value = editElement.innerText; // düzenlediğimiz etiketin içeriğini inputa aktardık.
editFlag = true;
editID = element.dataset.id; // düzenlenen öğenin kimliğini gönderdik
submitBtn.textContent = "Düzenle"; //Düzenle butonuna tıklanıldıgında ekle butonu düzenle olarak değişsin 
console.log(editID); // clear tum yapıyı remove ıtem içine girilen key i temizler
};

const clearItems = () => {
    const items = document.querySelectorAll(".grocery-item");
    // listede article etiket var mı
    if (items.length >0) {
items.forEach((item) => list.removeChild(item)); // for each ile dizi içerisinde bulunan her bir elemanı   listeden laldırdık   
}
displayAlert("Liste Boş", "danger")

localStorage.removeItem("list")
};

//yerel depoya öğe ekleme

const addTolocalStorage = (id,value) => {
    const grocery = {id,value};
    let items = getLocalStorage();
    items.push(grocery);
    console.log(items)
    
    localStorage.setItem("list",JSON.stringify(items))
};

function getLocalStorage() {
    return localStorage.getItem("list")

? JSON.parse(localStorage.getItem("list"))
:[];
}

//yerel depodan id sine göre silme işlemi

const removeFromLocalStorage = (id) => {
    let items = getLocalStorage();
    items=items.filter((item) => item.id !== id);
    localStorage.setItem("list", JSON.stringify(items));
};

const editLocalStore = (id, value) => {
    let items = getLocalStorage()// map geriye dizi döndürür
    items = items.map((item) => {
        if (item,id === id) {
            item.value = value
        }
        return item;
    });
    console.log (items)
    localStorage.setItem("list", JSON.stringify(items));
};

//gönderilen id ve value sahip bir öğe oluşturan fonksiyon
const createListItem = (id, value) => {
    const element = document.createElement("article") // Yeni bir article öğesi oluşturduk
    let attr = document.createAttribute("data-id"); //Yeni bir veri kimliği oluştur
    attr.value = id
    element.setAttributeNode(attr)// oluşturdugumuz id yi data özellik olarak set ettik
    element.classList.add("grocery-item");// article etiketine class ekledik
    element.innerHTML = `
    <p class="title">${value}</p>
    <div class="btn-container">
    <button type="button"
    class="edit-btn">
        <i class="fa-solid fa-pen-to-square"></i>
    </button>
    <button type="button" 
    class="delete-btn">
        <i class="fa-solid fa-trash"></i>   
    </button>
    </div>
    `;

    //*oluşturduğumuz bu butonlara olay izleyicileri ekleyebilmemiz için seçtik
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);// clicl olayı oldugunda delete metodu ekledik
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);
    list.appendChild(element); // oluşturduğumuz article etiketini htnl e ekledik
    


}

const setupItems = () => {
    let items = getLocalStorage();
    

    if (items.length > 0) {
    items.forEach((item) => {
        createListItem(item.id, item.value);
    });
        
    
}
};


//! Olay İzleyicileri

//* form gönderildiğide add ıtem fonksiyonu çalışır
form.addEventListener("submit", addItem);//olay izleyicisi gönderdik.türü gönderme.add ıtem ekleme işlemi.yukardada addıtem ı tanımladık 4 te
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);
