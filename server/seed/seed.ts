import dotenv from "dotenv";
import path from "path";
import neo4j from "neo4j-driver";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const uri = process.env.COGNODB_URI!;
const user = process.env.COGNODB_USER!;
const password = process.env.COGNODB_PASSWORD!;

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

const departments = [
  { name: "Finance" },
  { name: "Operations" },
  { name: "Sales & Marketing" },
  { name: "Human Resources" },
  { name: "IT & Engineering" },
  { name: "Customer Success" },
];

const agents = [
  { name: "Invoice Reconciliation Agent", role: "Financial Analyst", status: "active" },
  { name: "Payroll Processing Agent", role: "Payroll Specialist", status: "active" },
  { name: "Expense Audit Agent", role: "Compliance Analyst", status: "active" },
  { name: "Order Fulfillment Agent", role: "Operations Coordinator", status: "active" },
  { name: "Inventory Sync Agent", role: "Supply Chain Analyst", status: "active" },
  { name: "Shipment Tracking Agent", role: "Logistics Coordinator", status: "active" },
  { name: "Lead Scoring Agent", role: "Marketing Analyst", status: "active" },
  { name: "Campaign Analytics Agent", role: "Marketing Strategist", status: "active" },
  { name: "CRM Sync Agent", role: "Sales Operations", status: "active" },
  { name: "Employee Onboarding Agent", role: "HR Coordinator", status: "active" },
  { name: "PTO Management Agent", role: "HR Specialist", status: "idle" },
  { name: "Benefits Enrollment Agent", role: "Benefits Coordinator", status: "active" },
  { name: "Incident Response Agent", role: "SRE Engineer", status: "active" },
  { name: "Infrastructure Monitor Agent", role: "DevOps Engineer", status: "active" },
  { name: "Code Deployment Agent", role: "Release Engineer", status: "active" },
  { name: "Ticket Triage Agent", role: "Support Analyst", status: "active" },
  { name: "Customer Health Agent", role: "Customer Success Manager", status: "active" },
  { name: "Churn Prediction Agent", role: "Data Scientist", status: "idle" },
];

const workflows = [
  { name: "Order-to-Cash", description: "End-to-end order processing from receipt to revenue recognition", category: "Financial" },
  { name: "Procure-to-Pay", description: "Procurement lifecycle from purchase request to vendor payment", category: "Financial" },
  { name: "Month-End Close", description: "Monthly financial reconciliation and reporting cycle", category: "Financial" },
  { name: "Employee Lifecycle", description: "Full employee journey from hiring to offboarding", category: "HR" },
  { name: "Talent Acquisition", description: "Recruiting pipeline from job posting to offer acceptance", category: "HR" },
  { name: "IT Incident Management", description: "Incident detection, escalation, and resolution process", category: "IT" },
  { name: "CI/CD Pipeline", description: "Continuous integration and deployment automation", category: "IT" },
  { name: "Customer Onboarding", description: "New customer setup and activation workflow", category: "Customer Success" },
  { name: "Subscription Renewal", description: "Automated subscription renewal and billing process", category: "Customer Success" },
  { name: "Marketing Campaign Ops", description: "Campaign planning, execution, and performance tracking", category: "Marketing" },
  { name: "Inventory Replenishment", description: "Automated inventory monitoring and reorder process", category: "Operations" },
  { name: "Compliance Audit", description: "Regulatory compliance verification and reporting", category: "Financial" },
  { name: "Data Quality Assurance", description: "Cross-system data validation and cleansing", category: "IT" },
  { name: "Customer Support Escalation", description: "Tiered support escalation and resolution tracking", category: "Customer Success" },
  { name: "Revenue Forecasting", description: "Predictive revenue modeling and pipeline analysis", category: "Financial" },
  { name: "Vendor Management", description: "Vendor evaluation, onboarding, and performance tracking", category: "Operations" },
];

const systems = [
  { name: "Salesforce CRM", type: "CRM", vendor: "Salesforce" },
  { name: "SAP ERP", type: "ERP", vendor: "SAP" },
  { name: "Snowflake Warehouse", type: "Data Warehouse", vendor: "Snowflake" },
  { name: "Workday HCM", type: "HCM", vendor: "Workday" },
  { name: "Stripe Billing", type: "Payment Processing", vendor: "Stripe" },
  { name: "Jira Service Management", type: "ITSM", vendor: "Atlassian" },
  { name: "GitHub Enterprise", type: "Source Control", vendor: "GitHub" },
  { name: "Slack Messaging", type: "Communication", vendor: "Slack" },
  { name: "Tableau Analytics", type: "BI & Analytics", vendor: "Tableau" },
  { name: "AWS S3 Storage", type: "Cloud Storage", vendor: "AWS" },
  { name: "Okta Identity", type: "Identity Management", vendor: "Okta" },
  { name: "PagerDuty Alerting", type: "Incident Management", vendor: "PagerDuty" },
  { name: "HubSpot Marketing", type: "Marketing Automation", vendor: "HubSpot" },
  { name: "Zendesk Support", type: "Customer Support", vendor: "Zendesk" },
  { name: "NetSuite Financials", type: "Financial Management", vendor: "Oracle" },
  { name: "DocuSign Contracts", type: "Contract Management", vendor: "DocuSign" },
  { name: "Twilio Communications", type: "Communication API", vendor: "Twilio" },
  { name: "Datadog Monitoring", type: "Observability", vendor: "Datadog" },
];

const tasks = [
  { name: "Validate Invoice Line Items", type: "Validation", avgDurationMinutes: 5 },
  { name: "Match PO to Receipt", type: "Matching", avgDurationMinutes: 3 },
  { name: "Generate Aging Report", type: "Reporting", avgDurationMinutes: 8 },
  { name: "Process Payment Batch", type: "Transaction", avgDurationMinutes: 12 },
  { name: "Reconcile Bank Statements", type: "Reconciliation", avgDurationMinutes: 15 },
  { name: "Calculate Payroll Deductions", type: "Calculation", avgDurationMinutes: 7 },
  { name: "Submit Tax Filings", type: "Compliance", avgDurationMinutes: 20 },
  { name: "Audit Expense Claims", type: "Audit", avgDurationMinutes: 10 },
  { name: "Verify Receipt Authenticity", type: "Validation", avgDurationMinutes: 4 },
  { name: "Route Purchase Approval", type: "Approval", avgDurationMinutes: 2 },
  { name: "Check Inventory Levels", type: "Monitoring", avgDurationMinutes: 3 },
  { name: "Generate Reorder Alert", type: "Notification", avgDurationMinutes: 1 },
  { name: "Update Stock Quantities", type: "Data Sync", avgDurationMinutes: 5 },
  { name: "Track Shipment Status", type: "Monitoring", avgDurationMinutes: 2 },
  { name: "Confirm Delivery Receipt", type: "Validation", avgDurationMinutes: 3 },
  { name: "Score Inbound Lead", type: "Scoring", avgDurationMinutes: 4 },
  { name: "Enrich Contact Data", type: "Data Enrichment", avgDurationMinutes: 6 },
  { name: "Sync CRM Records", type: "Data Sync", avgDurationMinutes: 5 },
  { name: "Generate Campaign Report", type: "Reporting", avgDurationMinutes: 10 },
  { name: "A/B Test Analysis", type: "Analytics", avgDurationMinutes: 15 },
  { name: "Provision User Accounts", type: "Provisioning", avgDurationMinutes: 8 },
  { name: "Configure Access Permissions", type: "Security", avgDurationMinutes: 5 },
  { name: "Schedule Orientation Sessions", type: "Scheduling", avgDurationMinutes: 3 },
  { name: "Process PTO Requests", type: "Approval", avgDurationMinutes: 2 },
  { name: "Calculate Leave Balances", type: "Calculation", avgDurationMinutes: 4 },
  { name: "Enroll Benefits Selection", type: "Data Entry", avgDurationMinutes: 10 },
  { name: "Detect Infrastructure Anomaly", type: "Monitoring", avgDurationMinutes: 1 },
  { name: "Escalate Critical Incident", type: "Escalation", avgDurationMinutes: 2 },
  { name: "Execute Runbook Steps", type: "Automation", avgDurationMinutes: 15 },
  { name: "Post Incident Review", type: "Analysis", avgDurationMinutes: 30 },
  { name: "Run Integration Tests", type: "Testing", avgDurationMinutes: 12 },
  { name: "Build Docker Image", type: "Build", avgDurationMinutes: 8 },
  { name: "Deploy to Staging", type: "Deployment", avgDurationMinutes: 5 },
  { name: "Run Smoke Tests", type: "Testing", avgDurationMinutes: 3 },
  { name: "Promote to Production", type: "Deployment", avgDurationMinutes: 10 },
  { name: "Classify Support Ticket", type: "Classification", avgDurationMinutes: 2 },
  { name: "Route to Specialist", type: "Routing", avgDurationMinutes: 1 },
  { name: "Generate Customer Health Score", type: "Scoring", avgDurationMinutes: 8 },
  { name: "Predict Churn Risk", type: "ML Inference", avgDurationMinutes: 12 },
  { name: "Send Renewal Reminder", type: "Notification", avgDurationMinutes: 1 },
  { name: "Process Subscription Change", type: "Transaction", avgDurationMinutes: 5 },
  { name: "Validate Compliance Rules", type: "Validation", avgDurationMinutes: 10 },
  { name: "Generate Audit Trail", type: "Reporting", avgDurationMinutes: 7 },
  { name: "Cross-System Data Validation", type: "Validation", avgDurationMinutes: 15 },
  { name: "Deduplicate Records", type: "Data Cleansing", avgDurationMinutes: 20 },
  { name: "Forecast Revenue Pipeline", type: "Analytics", avgDurationMinutes: 25 },
  { name: "Evaluate Vendor Performance", type: "Analysis", avgDurationMinutes: 12 },
  { name: "Onboard New Vendor", type: "Provisioning", avgDurationMinutes: 30 },
  { name: "Setup Customer Workspace", type: "Provisioning", avgDurationMinutes: 15 },
  { name: "Send Welcome Sequence", type: "Notification", avgDurationMinutes: 2 },
  { name: "Configure Integrations", type: "Configuration", avgDurationMinutes: 20 },
];

const dataPipelines = [
  { name: "CRM-to-Warehouse Sync", direction: "downstream" },
  { name: "ERP Order Feed", direction: "downstream" },
  { name: "HCM Payroll Export", direction: "downstream" },
  { name: "Billing Event Stream", direction: "downstream" },
  { name: "Support Ticket Ingest", direction: "upstream" },
  { name: "Marketing Attribution Pipeline", direction: "downstream" },
  { name: "Monitoring Metrics Flow", direction: "downstream" },
  { name: "Identity Audit Log", direction: "downstream" },
];

const workflowDepartments: Record<string, string> = {
  "Order-to-Cash": "Finance",
  "Procure-to-Pay": "Finance",
  "Month-End Close": "Finance",
  "Employee Lifecycle": "Human Resources",
  "Talent Acquisition": "Human Resources",
  "IT Incident Management": "IT & Engineering",
  "CI/CD Pipeline": "IT & Engineering",
  "Customer Onboarding": "Customer Success",
  "Subscription Renewal": "Customer Success",
  "Marketing Campaign Ops": "Sales & Marketing",
  "Inventory Replenishment": "Operations",
  "Compliance Audit": "Finance",
  "Data Quality Assurance": "IT & Engineering",
  "Customer Support Escalation": "Customer Success",
  "Revenue Forecasting": "Finance",
  "Vendor Management": "Operations",
};

const workflowTasks: Record<string, string[]> = {
  "Order-to-Cash": ["Validate Invoice Line Items", "Match PO to Receipt", "Generate Aging Report", "Process Payment Batch"],
  "Procure-to-Pay": ["Route Purchase Approval", "Match PO to Receipt", "Process Payment Batch", "Validate Invoice Line Items"],
  "Month-End Close": ["Reconcile Bank Statements", "Generate Aging Report", "Validate Compliance Rules", "Generate Audit Trail"],
  "Employee Lifecycle": ["Provision User Accounts", "Configure Access Permissions", "Schedule Orientation Sessions", "Calculate Leave Balances"],
  "Talent Acquisition": ["Score Inbound Lead", "Enrich Contact Data", "Schedule Orientation Sessions", "Provision User Accounts"],
  "IT Incident Management": ["Detect Infrastructure Anomaly", "Escalate Critical Incident", "Execute Runbook Steps", "Post Incident Review"],
  "CI/CD Pipeline": ["Run Integration Tests", "Build Docker Image", "Deploy to Staging", "Run Smoke Tests", "Promote to Production"],
  "Customer Onboarding": ["Setup Customer Workspace", "Send Welcome Sequence", "Configure Integrations", "Generate Customer Health Score"],
  "Subscription Renewal": ["Send Renewal Reminder", "Process Subscription Change", "Generate Aging Report"],
  "Marketing Campaign Ops": ["Generate Campaign Report", "A/B Test Analysis", "Score Inbound Lead", "Enrich Contact Data"],
  "Inventory Replenishment": ["Check Inventory Levels", "Generate Reorder Alert", "Update Stock Quantities", "Track Shipment Status"],
  "Compliance Audit": ["Validate Compliance Rules", "Generate Audit Trail", "Audit Expense Claims", "Cross-System Data Validation"],
  "Data Quality Assurance": ["Cross-System Data Validation", "Deduplicate Records", "Sync CRM Records"],
  "Customer Support Escalation": ["Classify Support Ticket", "Route to Specialist", "Escalate Critical Incident", "Generate Customer Health Score"],
  "Revenue Forecasting": ["Forecast Revenue Pipeline", "Generate Aging Report", "Reconcile Bank Statements"],
  "Vendor Management": ["Evaluate Vendor Performance", "Onboard New Vendor", "Route Purchase Approval", "Validate Compliance Rules"],
};

const taskSystems: Record<string, string[]> = {
  "Validate Invoice Line Items": ["SAP ERP", "NetSuite Financials"],
  "Match PO to Receipt": ["SAP ERP"],
  "Generate Aging Report": ["NetSuite Financials", "Tableau Analytics"],
  "Process Payment Batch": ["Stripe Billing", "SAP ERP"],
  "Reconcile Bank Statements": ["NetSuite Financials", "Snowflake Warehouse"],
  "Calculate Payroll Deductions": ["Workday HCM"],
  "Submit Tax Filings": ["NetSuite Financials"],
  "Audit Expense Claims": ["SAP ERP", "AWS S3 Storage"],
  "Verify Receipt Authenticity": ["AWS S3 Storage"],
  "Route Purchase Approval": ["Slack Messaging", "SAP ERP"],
  "Check Inventory Levels": ["SAP ERP"],
  "Generate Reorder Alert": ["Slack Messaging"],
  "Update Stock Quantities": ["SAP ERP"],
  "Track Shipment Status": ["SAP ERP"],
  "Confirm Delivery Receipt": ["DocuSign Contracts"],
  "Score Inbound Lead": ["Salesforce CRM", "HubSpot Marketing"],
  "Enrich Contact Data": ["Salesforce CRM", "Snowflake Warehouse"],
  "Sync CRM Records": ["Salesforce CRM", "Snowflake Warehouse"],
  "Generate Campaign Report": ["HubSpot Marketing", "Tableau Analytics"],
  "A/B Test Analysis": ["HubSpot Marketing", "Snowflake Warehouse"],
  "Provision User Accounts": ["Okta Identity", "Workday HCM"],
  "Configure Access Permissions": ["Okta Identity"],
  "Schedule Orientation Sessions": ["Slack Messaging", "Workday HCM"],
  "Process PTO Requests": ["Workday HCM", "Slack Messaging"],
  "Calculate Leave Balances": ["Workday HCM"],
  "Enroll Benefits Selection": ["Workday HCM"],
  "Detect Infrastructure Anomaly": ["Datadog Monitoring", "PagerDuty Alerting"],
  "Escalate Critical Incident": ["PagerDuty Alerting", "Slack Messaging", "Jira Service Management"],
  "Execute Runbook Steps": ["Jira Service Management", "AWS S3 Storage"],
  "Post Incident Review": ["Jira Service Management", "Slack Messaging"],
  "Run Integration Tests": ["GitHub Enterprise"],
  "Build Docker Image": ["GitHub Enterprise", "AWS S3 Storage"],
  "Deploy to Staging": ["GitHub Enterprise", "AWS S3 Storage"],
  "Run Smoke Tests": ["Datadog Monitoring"],
  "Promote to Production": ["GitHub Enterprise", "Datadog Monitoring"],
  "Classify Support Ticket": ["Zendesk Support"],
  "Route to Specialist": ["Zendesk Support", "Slack Messaging"],
  "Generate Customer Health Score": ["Salesforce CRM", "Snowflake Warehouse"],
  "Predict Churn Risk": ["Snowflake Warehouse", "Salesforce CRM"],
  "Send Renewal Reminder": ["Salesforce CRM", "Twilio Communications"],
  "Process Subscription Change": ["Stripe Billing", "Salesforce CRM"],
  "Validate Compliance Rules": ["NetSuite Financials", "AWS S3 Storage"],
  "Generate Audit Trail": ["AWS S3 Storage", "Snowflake Warehouse"],
  "Cross-System Data Validation": ["Snowflake Warehouse", "Salesforce CRM", "SAP ERP"],
  "Deduplicate Records": ["Snowflake Warehouse"],
  "Forecast Revenue Pipeline": ["Salesforce CRM", "Snowflake Warehouse", "Tableau Analytics"],
  "Evaluate Vendor Performance": ["SAP ERP", "Tableau Analytics"],
  "Onboard New Vendor": ["SAP ERP", "DocuSign Contracts"],
  "Setup Customer Workspace": ["Okta Identity", "Salesforce CRM"],
  "Send Welcome Sequence": ["Twilio Communications", "HubSpot Marketing"],
  "Configure Integrations": ["Okta Identity", "Slack Messaging"],
};

const agentWorkflows: Record<string, string[]> = {
  "Invoice Reconciliation Agent": ["Order-to-Cash", "Procure-to-Pay"],
  "Payroll Processing Agent": ["Employee Lifecycle"],
  "Expense Audit Agent": ["Compliance Audit", "Procure-to-Pay"],
  "Order Fulfillment Agent": ["Order-to-Cash", "Inventory Replenishment"],
  "Inventory Sync Agent": ["Inventory Replenishment"],
  "Shipment Tracking Agent": ["Order-to-Cash", "Inventory Replenishment"],
  "Lead Scoring Agent": ["Marketing Campaign Ops", "Revenue Forecasting"],
  "Campaign Analytics Agent": ["Marketing Campaign Ops"],
  "CRM Sync Agent": ["Data Quality Assurance", "Marketing Campaign Ops"],
  "Employee Onboarding Agent": ["Employee Lifecycle", "Talent Acquisition"],
  "PTO Management Agent": ["Employee Lifecycle"],
  "Benefits Enrollment Agent": ["Employee Lifecycle"],
  "Incident Response Agent": ["IT Incident Management"],
  "Infrastructure Monitor Agent": ["IT Incident Management", "CI/CD Pipeline"],
  "Code Deployment Agent": ["CI/CD Pipeline"],
  "Ticket Triage Agent": ["Customer Support Escalation"],
  "Customer Health Agent": ["Customer Onboarding", "Subscription Renewal"],
  "Churn Prediction Agent": ["Subscription Renewal", "Revenue Forecasting"],
};

const agentTasks: Record<string, string[]> = {
  "Invoice Reconciliation Agent": ["Validate Invoice Line Items", "Match PO to Receipt", "Generate Aging Report"],
  "Payroll Processing Agent": ["Calculate Payroll Deductions", "Submit Tax Filings"],
  "Expense Audit Agent": ["Audit Expense Claims", "Verify Receipt Authenticity", "Validate Compliance Rules"],
  "Order Fulfillment Agent": ["Process Payment Batch", "Track Shipment Status", "Confirm Delivery Receipt"],
  "Inventory Sync Agent": ["Check Inventory Levels", "Update Stock Quantities", "Generate Reorder Alert"],
  "Shipment Tracking Agent": ["Track Shipment Status", "Confirm Delivery Receipt"],
  "Lead Scoring Agent": ["Score Inbound Lead", "Enrich Contact Data", "Forecast Revenue Pipeline"],
  "Campaign Analytics Agent": ["Generate Campaign Report", "A/B Test Analysis"],
  "CRM Sync Agent": ["Sync CRM Records", "Cross-System Data Validation", "Deduplicate Records"],
  "Employee Onboarding Agent": ["Provision User Accounts", "Configure Access Permissions", "Schedule Orientation Sessions"],
  "PTO Management Agent": ["Process PTO Requests", "Calculate Leave Balances"],
  "Benefits Enrollment Agent": ["Enroll Benefits Selection"],
  "Incident Response Agent": ["Detect Infrastructure Anomaly", "Escalate Critical Incident", "Execute Runbook Steps", "Post Incident Review"],
  "Infrastructure Monitor Agent": ["Detect Infrastructure Anomaly", "Run Smoke Tests"],
  "Code Deployment Agent": ["Run Integration Tests", "Build Docker Image", "Deploy to Staging", "Promote to Production"],
  "Ticket Triage Agent": ["Classify Support Ticket", "Route to Specialist"],
  "Customer Health Agent": ["Generate Customer Health Score", "Setup Customer Workspace", "Send Welcome Sequence", "Configure Integrations"],
  "Churn Prediction Agent": ["Predict Churn Risk", "Send Renewal Reminder", "Process Subscription Change"],
};

const pipelineConnections: { from: string; pipeline: string; to: string }[] = [
  { from: "Salesforce CRM", pipeline: "CRM-to-Warehouse Sync", to: "Snowflake Warehouse" },
  { from: "SAP ERP", pipeline: "ERP Order Feed", to: "Snowflake Warehouse" },
  { from: "Workday HCM", pipeline: "HCM Payroll Export", to: "NetSuite Financials" },
  { from: "Stripe Billing", pipeline: "Billing Event Stream", to: "Snowflake Warehouse" },
  { from: "Zendesk Support", pipeline: "Support Ticket Ingest", to: "Snowflake Warehouse" },
  { from: "HubSpot Marketing", pipeline: "Marketing Attribution Pipeline", to: "Snowflake Warehouse" },
  { from: "Datadog Monitoring", pipeline: "Monitoring Metrics Flow", to: "Snowflake Warehouse" },
  { from: "Okta Identity", pipeline: "Identity Audit Log", to: "AWS S3 Storage" },
];

async function seed() {
  const session = driver.session();
  console.log("Starting seed...");

  try {
    console.log("Clearing existing data...");
    await session.run("MATCH (n) DETACH DELETE n");

    console.log("Creating indexes...");
    await session.run("CREATE INDEX agent_name IF NOT EXISTS FOR (a:Agent) ON (a.name)");
    await session.run("CREATE INDEX workflow_name IF NOT EXISTS FOR (w:Workflow) ON (w.name)");
    await session.run("CREATE INDEX task_name IF NOT EXISTS FOR (t:Task) ON (t.name)");
    await session.run("CREATE INDEX system_name IF NOT EXISTS FOR (s:System) ON (s.name)");
    await session.run("CREATE INDEX pipeline_name IF NOT EXISTS FOR (p:DataPipeline) ON (p.name)");
    await session.run("CREATE INDEX department_name IF NOT EXISTS FOR (d:Department) ON (d.name)");

    console.log("Creating departments...");
    for (const dept of departments) {
      await session.run("MERGE (d:Department {name: $name})", dept);
    }

    console.log("Creating systems...");
    for (const sys of systems) {
      await session.run("MERGE (s:System {name: $name}) SET s.type = $type, s.vendor = $vendor", sys);
    }

    console.log("Creating data pipelines...");
    for (const pipeline of dataPipelines) {
      await session.run("MERGE (p:DataPipeline {name: $name}) SET p.direction = $direction", pipeline);
    }

    console.log("Creating pipeline connections...");
    for (const conn of pipelineConnections) {
      await session.run(
        `
        MATCH (from:System {name: $from})
        MATCH (p:DataPipeline {name: $pipeline})
        MATCH (to:System {name: $to})
        MERGE (from)-[:FEEDS]->(p)-[:FEEDS]->(to)
        `,
        conn
      );
    }

    console.log("Creating tasks...");
    for (const task of tasks) {
      await session.run(
        "MERGE (t:Task {name: $name}) SET t.type = $type, t.avgDurationMinutes = $avgDurationMinutes",
        task
      );
    }

    console.log("Creating task-system dependencies...");
    for (const [taskName, systemNames] of Object.entries(taskSystems)) {
      for (const systemName of systemNames) {
        await session.run(
          `
          MATCH (t:Task {name: $taskName})
          MATCH (s:System {name: $systemName})
          MERGE (t)-[:DEPENDS_ON]->(s)
          `,
          { taskName, systemName }
        );
      }
    }

    console.log("Creating workflows...");
    for (const wf of workflows) {
      await session.run(
        "MERGE (w:Workflow {name: $name}) SET w.description = $description, w.category = $category",
        wf
      );
    }

    console.log("Creating workflow-task relationships...");
    for (const [wfName, taskNames] of Object.entries(workflowTasks)) {
      for (const taskName of taskNames) {
        await session.run(
          `
          MATCH (w:Workflow {name: $wfName})
          MATCH (t:Task {name: $taskName})
          MERGE (w)-[:CONTAINS]->(t)
          `,
          { wfName, taskName }
        );
      }
    }

    console.log("Creating workflow-department relationships...");
    for (const [wfName, deptName] of Object.entries(workflowDepartments)) {
      await session.run(
        `
        MATCH (w:Workflow {name: $wfName})
        MATCH (d:Department {name: $deptName})
        MERGE (w)-[:OWNED_BY]->(d)
        `,
        { wfName, deptName }
      );
    }

    console.log("Creating agents...");
    for (const agent of agents) {
      await session.run(
        "MERGE (a:Agent {name: $name}) SET a.role = $role, a.status = $status",
        agent
      );
    }

    console.log("Creating agent-workflow assignments...");
    for (const [agentName, wfNames] of Object.entries(agentWorkflows)) {
      for (const wfName of wfNames) {
        await session.run(
          `
          MATCH (a:Agent {name: $agentName})
          MATCH (w:Workflow {name: $wfName})
          MERGE (a)-[:ASSIGNED_TO]->(w)
          `,
          { agentName, wfName }
        );
      }
    }

    console.log("Creating agent-task executions...");
    for (const [agentName, taskNames] of Object.entries(agentTasks)) {
      for (const taskName of taskNames) {
        await session.run(
          `
          MATCH (a:Agent {name: $agentName})
          MATCH (t:Task {name: $taskName})
          MERGE (a)-[:EXECUTES]->(t)
          `,
          { agentName, taskName }
        );
      }
    }

    console.log("\nSeed complete!");
    console.log(`  Departments: ${departments.length}`);
    console.log(`  Systems: ${systems.length}`);
    console.log(`  Data Pipelines: ${dataPipelines.length}`);
    console.log(`  Tasks: ${tasks.length}`);
    console.log(`  Workflows: ${workflows.length}`);
    console.log(`  Agents: ${agents.length}`);
    console.log(`  Total nodes: ${departments.length + systems.length + dataPipelines.length + tasks.length + workflows.length + agents.length}`);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();
