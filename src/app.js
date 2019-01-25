import $ from 'jquery';
import 'popper.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chart from 'chart.js'

import {home} from './home.js';

home.loadMainMenu();


/**
 *    Below is for testing canvas.js
 */

// document.querySelector('#main-content').innerHTML =`<div class="col-9 bg-dark w-200">
//                                                   <canvas id="myChart" class="bg-light"></canvas>
//                                                   </div>`

// var ctx = document.getElementById('myChart').getContext('2d');
// var chart = new Chart(ctx, {
//     // The type of chart we want to create
//     type: 'bar',

//     // The data for our dataset
//     data: {
//         labels: ["January", "February", "March", "April", "May", "June", "July"],
//         datasets: [{
//             label: "My First dataset",
//             backgroundColor: 'rgb(255, 99, 132)',
//             borderColor: 'rgb(255, 99, 132)',
//             data: [0, 10, 5, 2, 20, 30, 45],
//         }]
//     },

//     // Configuration options go here
//     options: {}
// });
