import axios from "axios";

const url = "http://10.10.12.62:4500/api/auth/login";

const payload = {
  email: "admin@gmail.com",
  password: "admin123",
};

// Total requests and concurrency (how many requests at once)
const TOTAL_REQUESTS = 500;
const CONCURRENCY = 50;

async function runLoadTest() {
  let successCount = 0;
  let failureCount = 0;
  const responseTimes: number[] = [];

  const batches = Math.ceil(TOTAL_REQUESTS / CONCURRENCY);

  for (let i = 0; i < batches; i++) {
    const currentBatchSize = Math.min(
      CONCURRENCY,
      TOTAL_REQUESTS - i * CONCURRENCY
    );

    const requests = Array.from({ length: currentBatchSize }, async () => {
      const start = Date.now();
      try {
        const res = await axios.post(url, payload);
        const duration = Date.now() - start;
        responseTimes.push(duration);
        successCount++;
        return res.data;
      } catch (err: any) {
        const duration = Date.now() - start;
        responseTimes.push(duration);
        failureCount++;
        return err.response?.data || err.message;
      }
    });

    await Promise.all(requests);
  }

  // Summary
  console.log("===== Load Test Summary =====");
  console.log("Total requests:", TOTAL_REQUESTS);
  console.log("Success:", successCount);
  console.log("Failure:", failureCount);
  console.log(
    "Avg response time:",
    (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(
      2
    ),
    "ms"
  );
  console.log("Min response time:", Math.min(...responseTimes), "ms");
  console.log("Max response time:", Math.max(...responseTimes), "ms");
}

runLoadTest();
