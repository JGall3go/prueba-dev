// PRG
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

// Selectors
jQuery(document).ready(function ($) {
  $(document).ready(function () {
    $('.mi-selector').select2()
  });
});

window.onload = (event) =>{
  
};

function filterMenu() {
  document.querySelector(".filter-menu").classList.toggle("active");
};

function gridView() {
  document.querySelector(".list").classList.remove("active");
  document.querySelector(".grid").classList.add("active");
  document.querySelector(".products-area-wrapper").classList.add("gridView");
  document.querySelector(".products-area-wrapper").classList.remove("tableView");
};

function listView() {
  document.querySelector(".list").classList.add("active");
  document.querySelector(".grid").classList.remove("active");
  document.querySelector(".products-area-wrapper").classList.remove("gridView");
  document.querySelector(".products-area-wrapper").classList.add("tableView");
};

function modeSwitch() {
  if(document.documentElement.classList.contains('light')) {
    var modeSwitchButton = document.querySelector('.mode-switch');
    document.documentElement.classList.toggle('light');
    modeSwitchButton.classList.toggle('active');
    document.cookie = "mode=Dark";
  } else {
    document.cookie = "mode=Light";
    var modeSwitchButton = document.querySelector('.mode-switch');
    document.documentElement.classList.toggle('light');
    modeSwitchButton.classList.toggle('active');
  }
}

function showForm() {
  const formContainer = document.querySelector('.form-container');
  formContainer.style.display = "flex";
}

function closeForm() {
  const formContainer = document.querySelector('.form-container');
  formContainer.style.display = "none";
}

function openRichTextEditor() {
  console.log("open");
}

function tagErrorHandler(label, state) {

  const errorLabel = document.querySelector(label);
  
  if(state == true) {
    errorLabel.style.display = "flex";
    errorLabel.parentNode.style.borderColor = "#b14f48";
  }

  if(state == false) {
    errorLabel.style.display = "none";
    errorLabel.parentNode.style.borderColor = "transparent";
  }
}

var tagsArray = new Array(); // This Array contains all Tags
function createTag(event) {

  const input = document.getElementById('add-tag-input');
  const tagger = document.getElementById('all-tags');
  const inputTag = document.getElementById('input-tag');

  // Restart Error Labels
  tagErrorHandler(".error-repeated-label", false);
  tagErrorHandler(".error-tags-label", false);
  tagErrorHandler(".error-characters-label", false);

  // Si la tecla presionada es Enter entonces se creara el div
  if (event.key == "Enter" || event == "[object MouseEvent]" || event == "[object PointerEvent]") {

    // Shopify only receives a maximum of 250 tags with a maximum of 255 characters.

    if (input.value != "" && tagsArray.indexOf(input.value) === -1 && tagsArray.length < 250 && input.value.length < 255) {
      inputTag.value += `${input.value},`;
      tagger.innerHTML += `<div class="tag" onclick="deleteTag(this)"><span class="tag-text">${input.value}</span><svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512"><title>Close</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="40" d="M368 368L144 144M368 144L144 368"></path></svg></div>`
      tagsArray.push(input.value);
      input.value = "";
    }

    // If any condition is not met
    if (tagsArray.indexOf(input.value) !== -1) { tagErrorHandler(".error-repeated-label", true); }
    if (tagsArray.length >= 250) { tagErrorHandler(".error-tags-label", true); }
    if (input.value.length >= 255) { tagErrorHandler(".error-characters-label", true); }

  }
}

function deleteTag(element) {

  // Tag is remove from the Array
  const tagText = element.querySelector('.tag-text');
  const inputTag = document.getElementById('input-tag');
  inputTag.value = inputTag.value.replace(`${tagText.innerHTML},`, '');
  tagsArray = tagsArray.filter(e => e !== tagText.innerHTML);

  element.remove();
}

// Sidebar
var display = false;
function dropMenu() {
  if(display == false) {
    let timeline = gsap.timeline(); // GSAP Timeline ( To animations )
    timeline.to(".sidebar", {duration: 0.20, left: "0%"}, 0) // Sequence start
    display = true;
    document.querySelector('.sidebar-background').classList.add('show');
  } else {
    let timeline = gsap.timeline(); // GSAP Timeline ( To animations )
    timeline.to(".sidebar", {duration: 0.20, left: "-100%"}, 0) // Sequence start
    display = false;
    document.querySelector('.sidebar-background').classList.remove('show');
  }
  
}

// Popup
function showNotify() {
  let timeline = gsap.timeline(); // GSAP Timeline ( To animations )
  timeline.to(".notification-container", {duration: 0.80, top: "auto"}) // Sequence start
  timeline.to(".notification-container", {duration: 3, top: "120%"}, 4)
}

function hideNotify() {

  let timeline = gsap.timeline(); // GSAP Timeline ( To animations )
  timeline.to(".notification-container", {duration: 0.3, top: "120%"}, 0) // Sequence start

}

// Product Description
function showDescription(number) {
  const description = document.querySelector(`.body-${number}`).style.display = "flex";
}

function hideDescription(number) {
  const description = document.querySelector(`.body-${number}`).style.display = "none";
}