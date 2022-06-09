'use strict';

// elements

const jsButton = document.querySelector(".js-search-btn")
const jsInput = document.querySelector("#js-search-input")
const nodeButton = document.querySelector(".node-search-btn")
const nodeInput = document.querySelector("#node-search-input")


jsButton.addEventListener('click',(event)=>{
  event.preventDefault();
  const searchTerm = jsInput.value;
  const newTerm = searchTerm.split(' ').join('+')
  window.open(`http://google.com/search?q=javascript+${newTerm}`,'_blank')
  jsInput.value = ''
    })

nodeButton.addEventListener('click',(event)=>{
  event.preventDefault();
  const searchTerm = nodeInput.value;
  const newTerm = searchTerm.split(' ').join('+')
  window.open(`http://google.com/search?q=node+${newTerm}`,'_blank')
  nodeInput.value = ''
    })
