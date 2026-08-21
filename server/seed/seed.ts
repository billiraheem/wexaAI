import dotenv from "dotenv";
import path from "path";
import neo4j from "neo4j-driver";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const uri = process.env.COGNODB_URI!;
const user = process.env.COGNODB_USER!;
const password = process.env.COGNODB_PASSWORD!;

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

// ─── 1. Core Curated Departments ───
const curatedDepartments = [
  { name: "Finance" },
  { name: "Operations" },
  { name: "Sales & Marketing" },
  { name: "Human Resources" },
  { name: "IT & Engineering" },
  { name: "Customer Success" },
];

const additionalDeptNames = [
  "Legal & Compliance", "Procurement", "Security Operations", "Product Management",
  "Risk Management", "Data Platform", "Customer Support", "Facilities & Real Estate",
  "Business Development", "Quality Assurance", "Executive Office", "Revenue Operations",
  "Strategic Partnerships", "Treasury Ops"
];

const allDepartments = [
  ...curatedDepartments,
  ...additionalDeptNames.map((name) => ({ name })),
];

// ─── 2. Core Curated Systems ───
const curatedSystems = [
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

const systemVendors = ["AWS", "Google Cloud", "Microsoft Azure", "Oracle", "IBM", "HashiCorp", "Databricks", "Elastic", "Redis", "MongoDB"];
const systemTypes = ["Database", "Cache", "Message Broker", "Microservice", "API Gateway", "Analytics Engine", "Storage Bucket", "Security Vault"];

const generatedSystems: Array<{ name: string; type: string; vendor: string }> = [];
const systemNamesList: string[] = curatedSystems.map((s) => s.name);

for (let i = 1; i <= 132; i++) {
  const v = systemVendors[i % systemVendors.length];
  const t = systemTypes[i % systemTypes.length];
  const name = `${v} ${t} Service #${i}`;
  generatedSystems.push({ name, type: t, vendor: v });
  systemNamesList.push(name);
}

const allSystems = [...curatedSystems, ...generatedSystems];

// ─── 3. Core Curated Data Pipelines ───
const curatedPipelines = [
  { name: "CRM-to-Warehouse Sync", direction: "downstream" },
  { name: "ERP Order Feed", direction: "downstream" },
  { name: "HCM Payroll Export", direction: "downstream" },
  { name: "Billing Event Stream", direction: "downstream" },
  { name: "Support Ticket Ingest", direction: "upstream" },
  { name: "Marketing Attribution Pipeline", direction: "downstream" },
  { name: "Monitoring Metrics Flow", direction: "downstream" },
  { name: "Identity Audit Log", direction: "downstream" },
];

const generatedPipelines: Array<{ name: string; direction: string }> = [];
for (let i = 1; i <= 92; i++) {
  generatedPipelines.push({
    name: `Pipeline Alpha-${i} (${i % 2 === 0 ? "Downstream" : "Upstream"})`,
    direction: i % 2 === 0 ? "downstream" : "upstream",
  });
}

const allPipelines = [...curatedPipelines, ...generatedPipelines];

// ─── 4. Core Curated Tasks ───
const curatedTasks = [
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

const taskTypes = ["Validation", "Data Sync", "Reporting", "Security", "Analytics", "Automation", "Transformation", "Audit"];

const generatedTasks: Array<{ name: string; type: string; avgDurationMinutes: number }> = [];
const taskNamesList: string[] = curatedTasks.map((t) => t.name);

for (let i = 1; i <= 749; i++) {
  const type = taskTypes[i % taskTypes.length];
  const name = `Automated Task Task-${i} (${type})`;
  generatedTasks.push({
    name,
    type,
    avgDurationMinutes: (i % 15) + 1,
  });
  taskNamesList.push(name);
}

const allTasks = [...curatedTasks, ...generatedTasks];

// ─── 5. Core Curated Workflows ───
const curatedWorkflows = [
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

const categories = ["Financial", "HR", "IT", "Customer Success", "Marketing", "Operations", "Security", "Legal"];
const generatedWorkflows: Array<{ name: string; description: string; category: string }> = [];
const workflowNamesList: string[] = curatedWorkflows.map((w) => w.name);

for (let i = 1; i <= 184; i++) {
  const cat = categories[i % categories.length];
  const name = `Workflow Process-X${i} (${cat})`;
  generatedWorkflows.push({
    name,
    description: `Automated enterprise workflow for ${cat} operations batch #${i}`,
    category: cat,
  });
  workflowNamesList.push(name);
}

const allWorkflows = [...curatedWorkflows, ...generatedWorkflows];

// ─── 6. Core Curated Agents ───
const curatedAgents = [
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

const roles = ["Financial Specialist", "Data Engineer", "Security Analyst", "Operations Specialist", "Automation Bot", "AI Assistant"];
const generatedAgents: Array<{ name: string; role: string; status: string }> = [];
const agentNamesList: string[] = curatedAgents.map((a) => a.name);

for (let i = 1; i <= 132; i++) {
  const role = roles[i % roles.length];
  const name = `AI Virtual Coworker Bot-${i}`;
  generatedAgents.push({
    name,
    role,
    status: i % 4 === 0 ? "idle" : "active",
  });
  agentNamesList.push(name);
}

const allAgents = [...curatedAgents, ...generatedAgents];

// ─── 7. Mappings & Relationships ───

// Curated mappings (preserved 100%)
const curatedWorkflowDepartments: Record<string, string> = {
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

const curatedWorkflowTasks: Record<string, string[]> = {
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

const curatedTaskSystems: Record<string, string[]> = {
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

const curatedAgentWorkflows: Record<string, string[]> = {
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

const curatedAgentTasks: Record<string, string[]> = {
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

const curatedPipelineConnections: { from: string; pipeline: string; to: string }[] = [
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
  console.log("Starting scale-up seed process (1,420 nodes, ~3,200 relationships)...");

  try {
    console.log("1/12 Clearing existing data...");
    await session.run("MATCH (n) DETACH DELETE n");

    console.log("2/12 Creating database indexes...");
    await session.run("CREATE INDEX agent_name IF NOT EXISTS FOR (a:Agent) ON (a.name)");
    await session.run("CREATE INDEX workflow_name IF NOT EXISTS FOR (w:Workflow) ON (w.name)");
    await session.run("CREATE INDEX task_name IF NOT EXISTS FOR (t:Task) ON (t.name)");
    await session.run("CREATE INDEX system_name IF NOT EXISTS FOR (s:System) ON (s.name)");
    await session.run("CREATE INDEX pipeline_name IF NOT EXISTS FOR (p:DataPipeline) ON (p.name)");
    await session.run("CREATE INDEX department_name IF NOT EXISTS FOR (d:Department) ON (d.name)");

    console.log(`3/12 Batch inserting ${allDepartments.length} departments...`);
    await session.run(
      "UNWIND $batch AS d MERGE (:Department {name: d.name})",
      { batch: allDepartments }
    );

    console.log(`4/12 Batch inserting ${allSystems.length} systems...`);
    await session.run(
      "UNWIND $batch AS s MERGE (sys:System {name: s.name}) SET sys.type = s.type, sys.vendor = s.vendor",
      { batch: allSystems }
    );

    console.log(`5/12 Batch inserting ${allPipelines.length} data pipelines...`);
    await session.run(
      "UNWIND $batch AS p MERGE (pipe:DataPipeline {name: p.name}) SET pipe.direction = p.direction",
      { batch: allPipelines }
    );

    console.log("6/12 Connecting data pipelines to systems...");
    // Curated connections
    for (const conn of curatedPipelineConnections) {
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
    // Generated pipeline connections
    const generatedPipelineConns = generatedPipelines.map((p, idx) => {
      const fromSys = systemNamesList[idx % systemNamesList.length];
      const toSys = systemNamesList[(idx + 5) % systemNamesList.length];
      return { from: fromSys, pipeline: p.name, to: toSys };
    });
    await session.run(
      `
      UNWIND $batch AS c
      MATCH (from:System {name: c.from})
      MATCH (p:DataPipeline {name: c.pipeline})
      MATCH (to:System {name: c.to})
      MERGE (from)-[:FEEDS]->(p)-[:FEEDS]->(to)
      `,
      { batch: generatedPipelineConns }
    );

    console.log(`7/12 Batch inserting ${allTasks.length} tasks...`);
    await session.run(
      "UNWIND $batch AS t MERGE (task:Task {name: t.name}) SET task.type = t.type, task.avgDurationMinutes = t.avgDurationMinutes",
      { batch: allTasks }
    );

    console.log("8/12 Connecting task-system dependencies...");
    // Curated task-system
    const taskSysPairs: { taskName: string; systemName: string }[] = [];
    for (const [taskName, sysList] of Object.entries(curatedTaskSystems)) {
      for (const systemName of sysList) {
        taskSysPairs.push({ taskName, systemName });
      }
    }
    // Generated task-system
    generatedTasks.forEach((t, idx) => {
      const sys1 = systemNamesList[idx % systemNamesList.length];
      const sys2 = systemNamesList[(idx + 7) % systemNamesList.length];
      taskSysPairs.push({ taskName: t.name, systemName: sys1 });
      taskSysPairs.push({ taskName: t.name, systemName: sys2 });
    });

    await session.run(
      `
      UNWIND $batch AS pair
      MATCH (t:Task {name: pair.taskName})
      MATCH (s:System {name: pair.systemName})
      MERGE (t)-[:DEPENDS_ON]->(s)
      `,
      { batch: taskSysPairs }
    );

    console.log(`9/12 Batch inserting ${allWorkflows.length} workflows...`);
    await session.run(
      "UNWIND $batch AS w MERGE (wf:Workflow {name: w.name}) SET wf.description = w.description, wf.category = w.category",
      { batch: allWorkflows }
    );

    console.log("10/12 Connecting workflow-task & workflow-department relationships...");
    const wfTaskPairs: { wfName: string; taskName: string }[] = [];
    for (const [wfName, taskList] of Object.entries(curatedWorkflowTasks)) {
      for (const taskName of taskList) {
        wfTaskPairs.push({ wfName, taskName });
      }
    }
    generatedWorkflows.forEach((w, idx) => {
      const t1 = taskNamesList[idx % taskNamesList.length];
      const t2 = taskNamesList[(idx + 3) % taskNamesList.length];
      const t3 = taskNamesList[(idx + 10) % taskNamesList.length];
      wfTaskPairs.push({ wfName: w.name, taskName: t1 });
      wfTaskPairs.push({ wfName: w.name, taskName: t2 });
      wfTaskPairs.push({ wfName: w.name, taskName: t3 });
    });

    await session.run(
      `
      UNWIND $batch AS pair
      MATCH (w:Workflow {name: pair.wfName})
      MATCH (t:Task {name: pair.taskName})
      MERGE (w)-[:CONTAINS]->(t)
      `,
      { batch: wfTaskPairs }
    );

    const wfDeptPairs: { wfName: string; deptName: string }[] = [];
    for (const [wfName, deptName] of Object.entries(curatedWorkflowDepartments)) {
      wfDeptPairs.push({ wfName, deptName });
    }
    generatedWorkflows.forEach((w, idx) => {
      const dept = allDepartments[idx % allDepartments.length].name;
      wfDeptPairs.push({ wfName: w.name, deptName: dept });
    });

    await session.run(
      `
      UNWIND $batch AS pair
      MATCH (w:Workflow {name: pair.wfName})
      MATCH (d:Department {name: pair.deptName})
      MERGE (w)-[:OWNED_BY]->(d)
      `,
      { batch: wfDeptPairs }
    );

    console.log(`11/12 Batch inserting ${allAgents.length} agents...`);
    await session.run(
      "UNWIND $batch AS a MERGE (ag:Agent {name: a.name}) SET ag.role = a.role, ag.status = a.status",
      { batch: allAgents }
    );

    console.log("12/12 Connecting agent assignments & executions...");
    const agentWfPairs: { agentName: string; wfName: string }[] = [];
    for (const [agentName, wfList] of Object.entries(curatedAgentWorkflows)) {
      for (const wfName of wfList) {
        agentWfPairs.push({ agentName, wfName });
      }
    }
    generatedAgents.forEach((a, idx) => {
      const w1 = workflowNamesList[idx % workflowNamesList.length];
      const w2 = workflowNamesList[(idx + 4) % workflowNamesList.length];
      agentWfPairs.push({ agentName: a.name, wfName: w1 });
      agentWfPairs.push({ agentName: a.name, wfName: w2 });
    });

    await session.run(
      `
      UNWIND $batch AS pair
      MATCH (a:Agent {name: pair.agentName})
      MATCH (w:Workflow {name: pair.wfName})
      MERGE (a)-[:ASSIGNED_TO]->(w)
      `,
      { batch: agentWfPairs }
    );

    const agentTaskPairs: { agentName: string; taskName: string }[] = [];
    for (const [agentName, taskList] of Object.entries(curatedAgentTasks)) {
      for (const taskName of taskList) {
        agentTaskPairs.push({ agentName, taskName });
      }
    }
    generatedAgents.forEach((a, idx) => {
      const t1 = taskNamesList[idx % taskNamesList.length];
      const t2 = taskNamesList[(idx + 8) % taskNamesList.length];
      agentTaskPairs.push({ agentName: a.name, taskName: t1 });
      agentTaskPairs.push({ agentName: a.name, taskName: t2 });
    });

    await session.run(
      `
      UNWIND $batch AS pair
      MATCH (a:Agent {name: pair.agentName})
      MATCH (t:Task {name: pair.taskName})
      MERGE (a)-[:EXECUTES]->(t)
      `,
      { batch: agentTaskPairs }
    );

    const totalNodes = allDepartments.length + allSystems.length + allPipelines.length + allTasks.length + allWorkflows.length + allAgents.length;
    const totalRels = generatedPipelineConns.length * 2 + taskSysPairs.length + wfTaskPairs.length + wfDeptPairs.length + agentWfPairs.length + agentTaskPairs.length;

    console.log("\n=======================================================");
    console.log(" SUCCESS! Enterprise Graph Scale Seeding Complete!");
    console.log("=======================================================");
    console.log(`  Departments:      ${allDepartments.length}`);
    console.log(`  Systems:          ${allSystems.length}`);
    console.log(`  Data Pipelines:   ${allPipelines.length}`);
    console.log(`  Tasks:            ${allTasks.length}`);
    console.log(`  Workflows:        ${allWorkflows.length}`);
    console.log(`  Agents:           ${allAgents.length}`);
    console.log(`-------------------------------------------------------`);
    console.log(`  TOTAL NODES:      ${totalNodes}`);
    console.log(`  TOTAL EDGES:      ~${totalRels}`);
    console.log("=======================================================\n");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();
