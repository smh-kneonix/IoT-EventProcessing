# **IoT Event Processing & Rule Matching System**

This project is a fully containerized microservices-based system designed for **processing IoT agent events**, **evaluating dynamic rules**, and **generating reports**.
It uses **NestJS**, **Kafka**, **MongoDB**, **Redis**, and **Kubernetes** to deliver a scalable, event-driven architecture suitable for real-time sensor data processing.

---

## 🚀 **What This Project Does**

This system simulates an IoT pipeline consisting of:

### **📡 Agent Service**

-   Generates random sensor events (temperature, voltage, etc.)
-   Each agent has a unique ID
-   Sends events to Kafka topic `agent-events`

### **⚙️ Process Service**

-   Consumes all events from Kafka
-   Stores events in MongoDB
-   Loads rules from Redis
-   Matches incoming events against dynamic rules
-   Appends matched rule IDs to the event record
-   Exposes APIs for:

    -   event listing
    -   rule management
    -   reporting (by rule / by agent)

### **✔ Rule Engine**

-   Rules are stored in Redis and MongoDB
-   Evaluates conditions using operators such as:
    `>`, `<`, `>=`, `<=`, `==`, `!=`

### **📊 Reporting**

Two major reporting endpoints:

-   `/events/rule/<ruleId>`
-   `/events/agent/<agentId>`
    Each supports pagination.

---

## 🛠 **Technologies Used**

| Technology             | Usage                                              |
| ---------------------- | -------------------------------------------------- |
| **NestJS**             | Backend implementation of Agent & Process services |
| **Kafka (Kafkajs)**    | Messaging and event streaming                      |
| **Shared NPM Package** | Reusable types, DTOs, interfaces, enums            |
| **MongoDB + Mongoose** | Event and rule storage                             |
| **Redis**              | Rule caching and high-speed lookups                |
| **Kubernetes**         | Deployment, scaling, pod management                |
| **Helm**               | Installing Skaffold and cluster dependencies       |
| **Skaffold**           | Hot-reload development in Kubernetes               |
| **Ingress NGINX**      | Exposes API under domain `part.dev`                |

---

## 📄 **Postman Collection**

A full Postman export (containing all endpoints for Agents, Rules, and Events) is available here:

👉 **[Postman Collection](./postman/export.json)**
_(Update the relative path based on your repo structure)_

---

# 🧩 **How to Run the Project**

Follow these steps to run the entire system locally using Kubernetes.

---

## 1️⃣ **Install Dependencies**

You must install these first:

### ✔ Kubernetes (Docker Desktop or Minikube)

### ✔ Helm

### ✔ Skaffold (installed via Helm)

---

## 2️⃣ **Build Docker Images (only the first time)**

Before your first `skaffold dev`, manually build Docker images for both services:

```bash
cd process && npm run docker:build
cd agent && npm run docker:build
```

You **only need to do this once**.

---

## 3️⃣ **Start the System**

From the project root:

```bash
skaffold dev
```

Skaffold will:

-   Build services
-   Apply all Kubernetes manifests
-   Deploy Kafka, Zookeeper, Mongo, Redis, Agent, Process
-   Activate live-reload for development

---

## 4️⃣ **Local Development Host Setup**

To access the system via Ingress at:

```
http://part.dev
```

Add this to your hosts file:

### **Windows**

```
# Add to C:\Windows\System32\drivers\etc\hosts
127.0.0.1 part.dev
```

### (Optional) macOS / Linux

```
sudo echo "127.0.0.1 part.dev" >> /etc/hosts
```

---

# 🌐 **System Architecture Overview**

```
Agent Service  --->  Kafka (agent-events topic) ---> Process Service
     |                                           ↳ Rule Engine (Redis)
     |
     ---> MongoDB (event storage)
                |
                ---> Event APIs + Reports
```

---

# 📦 **Available Services (via Ingress)**

| Service       | URL                                        |
| ------------- | ------------------------------------------ |
| Process API   | [http://part.dev/api](http://part.dev/api) |
| Agent Service | internal only                              |
| Kafka         | internal (ClusterIP)                       |

---

# 🎉 **You’re Ready to Go**

You now have a fully functional **event streaming + rule matching microservices system** running on Kubernetes with real-time messaging, storage, and reporting.
