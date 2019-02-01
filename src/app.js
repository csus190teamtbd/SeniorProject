require('./css/style.css')

import {home} from './home.js';

document.addEventListener("DOMContentLoaded", ()=>{
  document.querySelector('#thisYear').textContent = new Date().getFullYear();
});

document.querySelector('#navbar').addEventListener('click', (e)=>{
  console.log(e.target.id)
  switch (e.target.id) {
    case 'home':
      home.loadUI();
      home.loadActionListioner();
      break;
    case 'aboutBtn':
      console.log('aboutBtn')
      break;
    case 'contactBtn':
      console.log('contactBtn')
      break;
    default:
      break;
  }
})

function init(){
  home.loadUI();
  home.loadActionListioner();
}

init();
