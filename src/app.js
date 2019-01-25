// import $ from 'jquery';
import 'popper.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 *  d3 test code
 */
// import * as d3 from 'd3';
// const square = d3.selectAll("rect");
// square.style("fill", "orange");

import {home} from './home.js';

document.querySelector('#navbarBtn').addEventListener('click', (e)=>{
    switch (e.target.id) {
      case 'homeBtn':
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
