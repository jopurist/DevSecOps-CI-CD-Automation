# GitLab CI/CD Pipeline for Intern Project

This repository includes a GitLab CI/CD pipeline configuration that automates the following stages:

1. **Unit Testing**
2. **Docker Build & Push**
3. **Container Image Scanning**
4. **SonarQube Connection Test**
5. **Code Quality Scanning with SonarQube**

> This pipeline is optimized to run only when the commit message includes specific keywords (e.g., `run all`, `test sonar`).

---

## 🛠️ Pipeline Stages Overview

### 🔍 1. Test Code (`test-code`)
Runs unit tests using Node.js.

- **Image**: `node:lts-alpine`
- **Trigger**: When the commit message contains `run all`
- **Script**:
  - Install dependencies with `npm ci`
  - Run tests via `npm run test:ci`

### 🐳 2. Build Docker Image (`build`)
Builds and pushes a Docker image to GitLab Container Registry.

- **Image**: `docker:24.0.5` with `docker:dind`
- **Trigger**: `run all` in commit message
- **Script**:
  - Login to GitLab registry
  - Build image with commit short SHA tag
  - Push image to the registry

### 🛡️ 3. Image Scanning (`scan`)
Scans the built Docker image for vulnerabilities using [Trivy].

- **Image**: `aquasec/trivy:latest`
- **Script**:
  - Download the latest vulnerability database
  - Generate and print the scan report
  - Fail the job if critical vulnerabilities are found

### 🌐 4. Test SonarQube Connection (`test-sonar`)
Tests the connectivity between the runner and the SonarQube server.

- **Image**: `alpine`
- **Trigger**: Commit message must include `test sonar`
- **SetUp**:
  - Start the SonarQube Docker container: 
    docker run -d --name sonarqube SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true -p 9000:9000 sonarqube:latest
  - Access the SonarQube UI via `http://localhost:9000`
  - Login with default credentials Username='admin' and Password='admin'
  - Change the Password
  - Create a Local Project & Generate a new SONAR_TOKEN
  - Go to GitLab Variables and create two new variables named $SONAR_HOST_URL & $SONAR_TOKEN
  - Test the connection via `git commit -m "test sonar"`
- **Script**:
  - Install `curl`
  - Ping the SonarQube server using the configured URL

### 🧹 5. SonarQube Scan (`sonar`)
Runs [SonarQube] code quality analysis and waits for the Quality Gate result.

- **Image**: `sonarsource/sonar-scanner-cli:11`
- **Trigger**: When the commit message includes `run all`
- **Script**:
  - Run scanner with:
    - `sonar.projectKey=Intern-Project`
    - `sonar.sources=.` (entire source code)
    - `sonar.projectVersion` set to current commit SHA
    - `sonar.qualitygate.wait=true` (fail job if quality gate fails)

---

## 🧪 Quality Gate Enforcement

SonarQube scans will **wait for the quality gate result** before finishing. This helps enforce coding standards and ensures code meets the required quality criteria before it proceeds.

---

## ⚙️ Customization

You can:
- Adjust job triggers via the `rules:` sections.
- Change Docker image names and tags as needed.
- Update the `sonar.projectKey` and `sonar.projectVersion` logic.
- Modify Trivy scanning severity level or report format.

---

## 🏷️ Runner Tag

All jobs are assigned to the runner tagged as `Project_Runner`. Ensure your GitLab runner is registered with this tag.

---

## 🔐 Environment Variables Required

Make sure the following are configured as CI/CD variables in your GitLab project settings:

- `GITLAB_USERNAME`
- `PAT_TOKEN`
- `SONAR_HOST_URL`
- `SONAR_TOKEN`

---

## 🧾 Example Commit Message

To trigger the full pipeline, use a message like:

- `git commit -m "run all"`
- `git commit -m "test sonar"`
