# 🚀 GitLab CI/CD Pipeline for Intern Project

This repository contains a GitLab CI/CD pipeline configured to handle:

1. **Unit Testing**
2. **SonarQube Connection Testing**
3. **Code Quality Scanning with SonarQube**
4. **Docker Image Build & Push**
5. **Container Vulnerability Scanning with Trivy**

> ✅ The pipeline is triggered using **conventional commit messages** (e.g., `feat:`, `fix:`, `refactor:`, etc.) and optimized to run different jobs based on **branch names and commit types**.

---

## 🛠️ Pipeline Stages Overview

### 🔍 1. Test Code (`test-code`)
Runs unit tests using Node.js.

- **Image**: `node:lts-alpine`
- **Trigger**: On `dev` or `main` branch when using valid conventional commits
- **Script**:
  - Install dependencies (`npm ci`)
  - Run tests (`npm run test:ci`)
- **Artifacts**: Outputs `junit.xml` for test reporting

---

### 🌐 2. Test SonarQube Connection (`test-sonar`)
Tests the connectivity between the GitLab runner and the SonarQube server.

- **Image**: `alpine`
- **Trigger**: Only when the commit message starts with `test: sonar`
- **Setup**:
  - Run SonarQube locally with:  
    ```bash
    docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
    ```
  - Access the UI via `http://localhost:9000`
  - Login using default credentials `admin` / `admin`
  - Generate a new token
  - Set `$SONAR_HOST_URL` and `$SONAR_TOKEN` in GitLab CI/CD Variables
- **Script**:
  - Use `curl` to ping the SonarQube server

---

### 🧹 3. SonarQube Scan (`sonar`)
Performs static code analysis using SonarQube and enforces quality gates.

- **Image**: `sonarsource/sonar-scanner-cli:11`
- **Trigger**: Only on `main` branch with relevant commit types (e.g., `feat:`, `fix:`, `refactor:`)
- **Script**:
  - Scan the source code
  - Wait for quality gate results before proceeding
- **Versioning**: Uses the short SHA as the project version (`sonar.projectVersion`)

---

### 🐳 4. Build Docker Image (`build`)
Builds and pushes a Docker image tagged with the commit SHA.

- **Image**: `docker:24.0.5` with `docker:dind`
- **Trigger**: On `dev` and `main` branches with conventional commits
- **Script**:
  - Authenticate with GitLab Registry
  - Build and push the Docker image

---

### 🛡️ 5. Image Scanning (`scan`)
Uses [Trivy](https://github.com/aquasecurity/trivy) to scan the Docker image for vulnerabilities.

- **Image**: `aquasec/trivy:latest`
- **Trigger**: On `main` and `dev` branches with valid commit types
- **Script**:
  - Download latest vulnerability DB
  - Generate scan report
  - Fail the pipeline if critical vulnerabilities are found

---

## 🧪 Quality Gate Enforcement

The **SonarQube scan** waits for a quality gate decision before proceeding. This ensures:

- Code meets quality standards
- No new bugs, code smells, or vulnerabilities are introduced

---

## 🎯 Branch Strategy

| Branch | Behavior                                |
|--------|-----------------------------------------|
| `main` | Runs full pipeline including SonarQube  |
| `dev`  | Skips SonarQube analysis for speed      |

---

## ✅ Conventional Commit Examples

| Type       | Description                          | Example                                  |
|------------|--------------------------------------|------------------------------------------|
| `feat:`    | New feature                          | `feat(api): add endpoint for login`      |
| `fix:`     | Bug fix                              | `fix(ui): correct login form validation` |
| `refactor:`| Code restructure                     | `refactor(core): optimize loop logic`    |
| `perf:`    | Performance improvements             | `perf(api): improve response time`       |
| `build:`   | CI/CD, packaging-related changes     | `build(ci): update Docker build logic`   |

> 💡 Only these types will trigger the pipeline.

---

## 🏷️ Runner Tag

All jobs use the runner tag: `Project_Runner`  
Make sure your GitLab Runner is configured with this tag.

---

## 🔐 Required CI/CD Environment Variables

Add these to your GitLab project settings under **CI/CD > Variables**:

- `GITLAB_USERNAME`
- `PAT_TOKEN`
- `SONAR_HOST_URL`
- `SONAR_TOKEN`

---
