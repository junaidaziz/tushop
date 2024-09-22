const fs = require("fs");
const path = require("path");

const readFile = (filePath) => {
  return fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
};

const writeFile = (filePath, data) => {
  fs.writeFileSync(filePath, data, "utf8");
};

const parseGoodies = (data) => {
  return data.slice(2).map((line) => {
    const [goodie, priceString] = line.split(": ");
    return { goodie, price: parseInt(priceString) };
  });
};

const findFairDistribution = (goodies, numEmployees) => {
  // Sort goodies by price in ascending order
  const sortedGoodies = [...goodies].sort((a, b) => a.price - b.price);

  // Find the fair distribution
  return sortedGoodies.slice(0, sortedGoodies.length - numEmployees + 1).reduce(
    (bestDistribution, _, startIndex) => {
      // Extract the current set of goodies
      const currentSet = sortedGoodies.slice(
        startIndex,
        startIndex + numEmployees
      );

      // Calculate the price difference between the most expensive and least expensive goodies
      const priceDifference =
        currentSet[currentSet.length - 1].price - currentSet[0].price;

      // Update the best distribution if the current price difference is smaller
      return priceDifference < bestDistribution.minDifference
        ? { selectedGoodies: currentSet, minDifference: priceDifference }
        : bestDistribution;
    },
    // Initial best distribution with an empty set and infinite difference
    { selectedGoodies: [], minDifference: Infinity }
  );
};

const formatOutput = (goodies, minDifference) => {
  const goodiesList = goodies
    .map((item) => `${item.goodie}: ${item.price}`)
    .join("\n");

  return `The goodies selected for distribution are:

${goodiesList}

And the difference between the chosen goodie with highest price and the lowest price is ${minDifference}`;
};

const distributeGoodies = (inputFilePath, outputFilePath) => {
  // Read the input data from the specified file
  const data = readFile(inputFilePath);

  // Extract the number of employees from the first line
  const numberOfEmployees = parseInt(data[0].split(": ")[1]);

  // Parse the remaining lines to create an array of goodies
  const goodies = parseGoodies(data);

  // Find the optimal distribution of goodies among the employees
  const { selectedGoodies, minDifference } = findFairDistribution(
    goodies,
    numberOfEmployees
  );

  // Format the output string
  const output = formatOutput(selectedGoodies, minDifference);

  // Write the output to the specified file
  writeFile(outputFilePath, output);

  console.log(`Output written to ${outputFilePath}`);
};

const inputFilePath = path.join(__dirname, "sample_input.txt");
const outputFilePath = path.join(__dirname, "sample_output.txt");

distributeGoodies(inputFilePath, outputFilePath);
