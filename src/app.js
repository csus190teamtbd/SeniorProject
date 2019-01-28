// import $ from 'jquery';
// import 'popper.js';
// import 'bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

/**
 *  d3 test code
 */
// import * as d3 from 'd3';
// const square = d3.selectAll("rect");
// square.style("fill", "orange");

require('./css/style.css')

// temp
// import {oneProportion} from './oneProportion/oneProportion'

import {home} from './home.js';

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

  //temp
  // oneProportion.loadUI();
  // oneProportion.loadEventListeners();
  // oneProportion.initChart();

}

init();
