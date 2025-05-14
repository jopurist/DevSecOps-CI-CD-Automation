
# 🚀 GitLab CI/CD Pipeline for Intern Project

This repository is equipped with a GitLab CI/CD pipeline that automates the full software lifecycle, from testing and code analysis to Docker image management and Kubernetes deployment.

---

## 📋 CI/CD Stages Overview

1. **Unit Testing**
2. **Code Quality Scanning with SonarQube**
3. **Docker Image Build for Dev and Prod**
4. **Container Image Vulnerability Scanning**
5. **Kubernetes Deployment for Dev and Prod**

---

## 📦 Requirements

Make sure the following tools and services are set up:

- [x] GitLab (with CI/CD enabled)
- [x] GitLab Runner (tagged: `VM_Runner`)
- [x] Docker + Docker-in-Docker (`dind`)
- [x] [Trivy](https://github.com/aquasecurity/trivy)
- [x] [SonarQube](https://www.sonarqube.org/)
- [x] Kubernetes cluster (Dev and Prod environments)

---

## 🧪 Stage: Unit Test

**Job**: `test-job`  
**Purpose**: Run unit tests using Node.js  
**Image**: `node:lts-alpine`  
**Trigger**: On commits to the `dev` branch  
**Outputs**: JUnit test report (`coverage/junit.xml`)  
**Runner Tag**: `VM_Runner`

---

## 🔍 Stage: SonarQube Scan

**Job**: `sonarscanner-job`  
**Purpose**: Perform static code analysis  
**Image**: `sonarsource/sonar-scanner-cli:11`  
**Trigger**: On merge requests targeting `main`  
**Key Features**:
- Quality gate enforcement
- Caches analysis results
- Uses short SHA for versioning

---

## 🛠️ Stage: Docker Build (Non-Production)

**Job**: `build-job-non-prod`  
**Purpose**: Build and push Docker image for development  
**Image**: `docker:24.0.5` using `docker:dind`  
**Trigger**: On tags matching `dev-v*.*.*`  
**Image Tag**: `$CI_COMMIT_TAG`  
**Runner Tag**: `VM_Runner`

---

## 🏗️ Stage: Docker Build (Production)

**Job**: `build-job-prd`  
**Purpose**: Build and push production Docker image  
**Trigger**: On tags matching `prd-v*.*.*`  
**Other config same as non-prod build**

---

## 🛡️ Stage: Image Vulnerability Scanning

**Job**: `image_scan`  
**Tool**: [Trivy](https://github.com/aquasecurity/trivy)  
**Image**: `aquasec/trivy:latest`  
**Trigger**: On tags matching `prd-v*.*.*`  
**Checks**:
- Generates a full vulnerability report (`gl-container-scanning-report.json`)
- Fails pipeline on **CRITICAL** vulnerabilities

---

## 🚀 Stage: Dev Deployment

**Job**: `dev-deployment`  
**Purpose**: Update Kubernetes YAML with new Docker tag and push to `deployment` branch  
**Trigger**: On tags matching `dev-v*.*.*`  
**Files Updated**: `deployment/dev/dev-deployment.yml`  
**Runner Tag**: `VM_Runner`

---

## 🚀 Stage: Production Deployment

**Job**: `prod-deployment`  
**Purpose**: Update Kubernetes deployment for production  
**Trigger**: On tags matching `prd-v*.*.*`  
**Depends On**: `image_scan`  
**Files Updated**: `deployment/prod/prod-deployment.yml`  
**Runner Tag**: `VM_Runner`

---

## 🏷️ GitLab Runner Tag

All jobs require the GitLab Runner to be tagged with:

```text
VM_Runner
