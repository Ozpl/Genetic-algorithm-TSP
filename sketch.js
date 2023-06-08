/*
Piotr Zakrzewski @Ozpl, 2023

A simple demo designed to show how to solve
Travelling Salesman Problem using genetic algorithm,
while also adding the cities dynamically via mouse press.
https://en.wikipedia.org/wiki/Travelling_salesman_problem

Inspired by Coding Train's video:
https://www.youtube.com/watch?v=M3KTWnTrU_c

Code of his example can be found at p5js web editor,
along with geneticAlgorithm.js file used in this project:
https://editor.p5js.org/codingtrain/sketches/EGjTrkkf9
*/

const canvasW = 700
const canvasH = 700
const popSize = 500
const fitness = []

let cities = []
let maxCities = 30
let cityAdded = false

let population = []
let bestEver
let currentBest

let orderedDistance = 0
let optimalDistance = Infinity

function setup() {
  createCanvas(canvasW, canvasH)
  
  orderedDistanceText = select('#ordered-distance')
  optimalDistanceText = select('#optimal-distance')
  optimalPathText = select('#optimal-path')
}

function draw() {
  //Clear background
  background(0)
  
  //Add new city and build new starting population
  if (cityAdded) {
    orderedDistance = 0
    optimalDistance = Infinity
    order = [...Array(cities.length).keys()]
    
    for (let i = 0; i < popSize; i++) {
      population[i] = shuffle(order)
    }
  }
  
  // Genetic algorithm functions
  calculateFitness();
  normalizeFitness();
  nextGeneration();

  // Lines between cities and distances update
  if (cities.length > 1) {
    for (let i = 0; i < bestEver.length - 1; i++) {      
      // Ordered
      let ordA = cities[i]
      let ordB = cities[i+1]
      stroke(color(0, 102, 0, 125))
      strokeWeight(3)
      line(ordA.x, ordA.y, ordB.x, ordB.y)
      
      // Optimal
      let optA = cities[bestEver[i]]
      let optB = cities[bestEver[i + 1]]
      stroke(color(255, 0, 255, 255))
      strokeWeight(7)
      line(optA.x, optA.y, optB.x, optB.y)
      
      orderedDistance = calcDistance(cities, [...Array(cities.length).keys()])
      orderedDistanceText.html("Ordered distance (1-2-...-n): " + round(orderedDistance))
      optimalDistanceText.html("Optimal distance: " + round(optimalDistance))
    }
    
    // Create optimal path numbering
    let optimalPath = ''
    for (let i = 0; i < bestEver.length; i++) {
      optimalPath += bestEver[i]+1 + '-'
    }
    optimalPathText.html("Optimal path: " + optimalPath.slice(0, -1))
  }
  
  // Cities dots
  stroke("white")
  strokeWeight(1)
  for (let i = 0; i < cities.length; i++) {
    circle(cities[i].x, cities[i].y, 30)
    textSize(24)
    textAlign(CENTER)
    text(i+1, cities[i].x, cities[i].y + 8)
  }
  
  // Disable flag for adding cities
  cityAdded = false
}

// Add city on mouseReleased event
function mouseReleased() {
  if (cities.length < maxCities &&
      mouseX > 0 && mouseX < canvasW &&
      mouseY > 0 && mouseY < canvasH) {
    cities.push(createVector(mouseX, mouseY))
    cityAdded = true
  }
}