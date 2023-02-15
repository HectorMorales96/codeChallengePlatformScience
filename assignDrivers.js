const fs = require('fs');

// Read the shipment destinations of the shipments.txt and drivers.txt files
const shipments = fs.readFileSync('shipments.txt', 'utf8').trim().split('\n');
const drivers = fs.readFileSync('drivers.txt', 'utf8').trim().split('\n');

// Define a function to calculate the suitability score
function calculateSuitabilityScore(shipment, driver) {
  const shipmentLength = shipment.length;
  const driverLength = driver.length;
  let baseSS;
  
  if (shipmentLength % 2 === 0) {
    // If the shipment destination street name length is even, calculate base suitability score based on number of vowels in driver name
    const vowels = driver.match(/[aeiou]/gi);
    baseSS = vowels ? vowels.length * 1.5 : 0;
  } else {
    // If the shipment destination street name length is odd, calculate base suitability score based on number of consonants in driver name
    const consonants = driver.match(/[^aeiou/S.]/gi);
    baseSS = consonants ? consonants.length : 0;
  }
  
  // Check if the shipment length shares any common factors with the driver length, and increase suitability score by 50% if it does
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  if (gcd(shipmentLength, driverLength) !== 1) {
    return baseSS * 1.5;
  } else {
    return baseSS;
  }
}

// Assign shipments to drivers
let totalSS = 0;
const assignments = {};
const availableDrivers = new Set(drivers);

for (const shipment of shipments) {
  let bestDriver;
  let bestScore = -1;
  
  // Iterate over available drivers and find the one with the highest suitability score for the current shipment
  for (const driver of availableDrivers) {
    const score = calculateSuitabilityScore(shipment.toLowerCase(), driver.toLowerCase());
    if (score > bestScore) {
      bestDriver = driver;
      bestScore = score;
    }
  }
  
  // Assign the shipment to the best driver and remove it from the available drivers list
  assignments[shipment] = bestDriver;
  totalSS += bestScore;
  availableDrivers.delete(bestDriver);
}

// Output the total suitability score and the shipment-to-driver assignments
for (const shipment in assignments) {
  console.log(`${shipment} -> ${assignments[shipment]}`);
}
