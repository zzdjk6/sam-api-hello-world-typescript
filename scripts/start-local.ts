import { execSync } from "node:child_process";

const PORT = 3000;

const main = () => {
  stopDockerContainers();
  runCommand(`npx -y kill-port ${PORT}`);

  runCommand("sam build");
  runCommand(`sam local start-api --port ${PORT}`);
};

const stopDockerContainers = () => {
  const lines = execSync("docker ps")
    .toString()
    .split("\n")
    .map((line) => line.trim());

  if (lines.length === 0) {
    console.debug("No docker container is running");
    return;
  }

  for (const line of lines) {
    const idx = lines.indexOf(line);

    if (idx === 0) {
      continue;
    }

    const values = line.split(/\s+/);

    if (values.length < 2) {
      continue;
    }

    const containerId = values[0];
    const containerImage = values[1];
    if (!containerImage.includes("public.ecr.aws/lambda/nodejs")) {
      continue;
    }

    runCommand(`docker stop ${containerId}`);
  }
};

const runCommand = (command: string) => {
  console.log(`Run command: ${command}`);
  console.log("=======================");

  execSync(command, {
    stdio: "inherit",
  });

  console.log("\n");
};

main();
