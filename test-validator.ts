import { isValidJobDescription } from "./src/lib/ai/validator";

async function run() {
  const goodJob = `Software Engineer - Google
Requirements:
- 5+ years building scalable backends
- Expert in TypeScript and Node.js
- Experience with distributed systems`;

  const badJob = `asdgagsdg asdg asdf gsd`;

  const anotherBadJob = `hello I am testing something 12345`;

  console.log("Good job validation:", await isValidJobDescription(goodJob)); // should be true
  console.log("Bad job validation (mashing):", await isValidJobDescription(badJob)); // should be false
  console.log("Bad job validation (random words):", await isValidJobDescription(anotherBadJob)); // should be false
}

run().catch(console.error);
