import { createClient } from "redis";
import fs from "fs";
import { spawn } from "bun";
import { db } from "./prisma/db";

const client = await createClient();

client
  .connect()
  .then(async () => {
    await db.connect({ url: process.env.DATABASE_URL! });

    while (1) {
      const response = await client.rPop("problems");
      if (!response) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
        continue;
      }

      const parssedResponse = JSON.parse(response);
      const code = parssedResponse.code;
      const language = parssedResponse.language;
      const submissionId = parssedResponse.submissionId;

      if (language === "ts") {
        const filePath = __dirname + `/code/${submissionId}.ts`;
        console.log("Running user's TypeScript code:", code);

        fs.writeFileSync(filePath, code);

        const proc = spawn(["node", filePath], { stdout: "pipe", stderr: "pipe" });

        try {
          const [stdout, stderr, exitCode] = await Promise.all([
            new Response(proc.stdout).text(),
            new Response(proc.stderr).text(),
            proc.exited,
          ]);

          console.log("Process exited with code:", exitCode);

          await db.orm.public.Submissions
            .where({ id: submissionId })
            .update({
              status: exitCode === 0 ? "Succus" : "Fail", // match your current enum spelling
              output: exitCode === 0 ? stdout : stderr,
            });

          console.log("Submission updated:", submissionId);
        } catch (err) {
          console.error("Failed to process submission", submissionId, err);
        }
      }

      if (language === "js") {
        const filePath = __dirname + `/code/${submissionId}.js`;
        console.log("Running user's JavaScript code:", code);

        fs.writeFileSync(filePath, code);

        const proc = spawn(["node", filePath], { stdout: "pipe", stderr: "pipe" });

        try {
          const [stdout, stderr, exitCode] = await Promise.all([
            new Response(proc.stdout).text(),
            new Response(proc.stderr).text(),
            proc.exited,
          ]);

          console.log("Process exited with code:", exitCode);

          await db.orm.public.Submissions
            .where({ id: submissionId })
            .update({
              status: exitCode === 0 ? "Succus" : "Fail",
              output: exitCode === 0 ? stdout : stderr,
            });

          console.log("Submission updated:", submissionId);
        } catch (err) {
          console.error("Failed to process submission", submissionId, err);
        }
      }

      if (language === "py") {
        const filePath = __dirname + `/code/${submissionId}.py`;
        console.log("Running user's Python code:", code);

        fs.writeFileSync(filePath, code);

        const proc = spawn(["python3", filePath], { stdout: "pipe", stderr: "pipe" });

        try {
          const [stdout, stderr, exitCode] = await Promise.all([
            new Response(proc.stdout).text(),
            new Response(proc.stderr).text(),
            proc.exited,
          ]);

          console.log("Process exited with code:", exitCode);

          await db.orm.public.Submissions
            .where({ id: submissionId })
            .update({
              status: exitCode === 0 ? "Succus" : "Fail",
              output: exitCode === 0 ? stdout : stderr,
            });

          console.log("Submission updated:", submissionId);
        } catch (err) {
          console.error("Failed to process submission", submissionId, err);
        }
      }

      if (language === "cpp") {
        const srcPath = __dirname + `/code/${submissionId}.cpp`;
        const binPath = __dirname + `/code/${submissionId}.out`;
        console.log("Running user's C++ code:", code);

        fs.writeFileSync(srcPath, code);

        try {
          // 1. Compile
          const compile = spawn(["g++", "-o", binPath, srcPath], {
            stdout: "pipe",
            stderr: "pipe",
          });

          const [, compileErr, compileExit] = await Promise.all([
            new Response(compile.stdout).text(),
            new Response(compile.stderr).text(),
            compile.exited,
          ]);

          if (compileExit !== 0) {
            console.log("Compilation failed:", compileErr);

            await db.orm.public.Submissions
              .where({ id: submissionId })
              .update({
                status: "Fail",
                output: compileErr,
              });
          } else {
            // 2. Run the compiled binary
            const run = spawn([binPath], { stdout: "pipe", stderr: "pipe" });

            const [runOut, runErr, runExit] = await Promise.all([
              new Response(run.stdout).text(),
              new Response(run.stderr).text(),
              run.exited,
            ]);

            console.log("Exit code:", runExit);

            await db.orm.public.Submissions
              .where({ id: submissionId })
              .update({
                status: runExit === 0 ? "Succus" : "Fail",
                output: runExit === 0 ? runOut : runErr,
              });
          }

          console.log("Submission updated:", submissionId);
        } catch (err) {
          console.error("Failed to process submission", submissionId, err);
        }
      }
    } // closes while(1)
  })
  .catch((err) => {
    console.error("Error connecting to Redis:", err);
  });

export { client };