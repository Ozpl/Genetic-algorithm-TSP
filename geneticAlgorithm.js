// Daniel Shiffman
// The Coding Train
// Traveling Salesperson with Genetic Algorithm

// https://thecodingtrain.com/CodingChallenges/035.4-tsp.html
// https://youtu.be/M3KTWnTrU_c
// https://thecodingtrain.com/CodingChallenges/035.5-tsp.html
// https://youtu.be/hnxn6DtLYcY

function calculateFitness() {
  let currentRecord = Infinity;
  for (let i = 0; i < population.length; i++) {
    const d = calcDistance(cities, population[i]);
    if (d < optimalDistance) {
      optimalDistance = d;
      bestEver = population[i];
    }
    if (d < currentRecord) {
      currentRecord = d;
      currentBest = population[i];
    }

    // This fitness function has been edited from the original video
    // to improve performance, as discussed in The Nature of Code 9.6 video,
    // available here: https://www.youtube.com/watch?v=HzaLIO9dLbA
    fitness[i] = 1 / (pow(d, 8) + 1);
  }
}

function normalizeFitness() {
  let sum = 0;
  for (let i = 0; i < fitness.length; i++) {
    sum += fitness[i];
  }
  for (let i = 0; i < fitness.length; i++) {
    fitness[i] = fitness[i] / sum;
  }
}

function nextGeneration() {
  const newPopulation = [];
  for (var i = 0; i < population.length; i++) {
    const orderA = pickOne(population, fitness);
    const orderB = pickOne(population, fitness);
    const order = crossOver(orderA, orderB);
    mutate(order, 0.01);
    newPopulation[i] = order;
  }
  population = newPopulation;

}

function pickOne(list, prob) {
  let index = 0;
  let r = random(1);

  while (r > 0) {
    r = r - prob[index];
    index++;
  }
  index--;
  return list[index].slice();
}

function crossOver(orderA, orderB) {
  const start = floor(random(orderA.length));
  const end = floor(random(start + 1, orderA.length));
  const neworder = orderA.slice(start, end);
  // var left = totalCities - neworder.length;
  for (let i = 0; i < orderB.length; i++) {
    const city = orderB[i];
    if (!neworder.includes(city)) {
      neworder.push(city);
    }
  }
  return neworder;
}


function mutate(order, mutationRate) {
  for (let i = 0; i < cities.length; i++) {
    if (random(1) < mutationRate) {
      const indexA = floor(random(order.length));
      const indexB = (indexA + 1) % cities.length;
      swap(order, indexA, indexB);
    }
  }
}


function calcDistance(points, order) {
  let sum = 0;
  for (let i = 0; i < order.length - 1; i++) {
    const cityAIndex = order[i];
    const cityA = points[cityAIndex];
    const cityBIndex = order[i + 1];
    const cityB = points[cityBIndex];
    const d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
  }
  return sum;
}

function swap(a, i, j) {
  const temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}