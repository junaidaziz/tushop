const readline = require("readline");

const toMinutes = (time) => {
  const hours = parseInt(time.substring(0, 2));
  const minutes = parseInt(time.substring(2, 4));
  return hours * 60 + minutes;
};

const findLastNonOverlappingJob = (jobs, index) => {
  let low = 0,
    high = index - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (jobs[mid].endTime <= jobs[index].startTime) {
      if (jobs[mid + 1].endTime <= jobs[index].startTime) {
        low = mid + 1;
      } else {
        return mid;
      }
    } else {
      high = mid - 1;
    }
  }
  return -1;
};

const calculateMaxProfit = (jobs) => {
  // Total number of jobs
  const totalJobs = jobs.length;

  // Dynamic programming array to store maximum profit up to each job
  const dp = Array(totalJobs).fill(0);

  // Sort jobs by end time in ascending order
  jobs.sort((a, b) => a.endTime - b.endTime);

  // Base case: maximum profit for the first job is its own profit
  dp[0] = jobs[0].profit;

  // Iterate through the remaining jobs
  for (let i = 1; i < totalJobs; i++) {
    // Calculate the profit of including the current job
    const includeProfit =
      jobs[i].profit +
      (findLastNonOverlappingJob(jobs, i) !== -1
        ? dp[findLastNonOverlappingJob(jobs, i)]
        : 0);

    // Update the maximum profit for the current job
    dp[i] = Math.max(includeProfit, dp[i - 1]);
  }

  // Maximum profit that can be earned
  const maxProfit = dp[totalJobs - 1];

  // Selected jobs for maximum profit
  const selectedJobs = [];

  // Backtrack to find the selected jobs
  let i = totalJobs - 1;
  while (i >= 0) {
    const includeProfit =
      jobs[i].profit +
      (findLastNonOverlappingJob(jobs, i) !== -1
        ? dp[findLastNonOverlappingJob(jobs, i)]
        : 0);

    if (includeProfit > (i > 0 ? dp[i - 1] : 0)) {
      selectedJobs.push(jobs[i]);
      i = findLastNonOverlappingJob(jobs, i);
    } else {
      i--;
    }
  }

  // Calculate remaining jobs and earnings
  const remainingJobsCount = jobs.length - selectedJobs.length;
  const remainingEarnings =
    jobs.reduce((acc, job) => acc + job.profit, 0) - maxProfit;

  return [remainingJobsCount, remainingEarnings];
};

const main = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter the number of Jobs\n", (numJobs) => {
    let jobs = [];
    let jobCount = 0;

    const getJobDetails = () => {
      rl.question(
        "Enter job start time, end time, and earnings\n",
        (startTime) => {
          rl.question("", (endTime) => {
            rl.question("", (profit) => {
              jobs.push({
                startTime: toMinutes(startTime.trim()),
                endTime: toMinutes(endTime.trim()),
                profit: parseInt(profit.trim()),
              });
              jobCount++;

              if (jobCount < numJobs) {
                getJobDetails();
              } else {
                const result = calculateMaxProfit(jobs);
                console.log(
                  `The number of tasks and earnings available for others`
                );
                console.log(`Task: ${result[0]}`);
                console.log(`Earnings: ${result[1]}`);
                rl.close();
              }
            });
          });
        }
      );
    };

    getJobDetails();
  });
};

main();
