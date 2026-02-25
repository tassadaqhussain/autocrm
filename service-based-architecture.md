# Service-Based Modular Architecture

This system supports multiple service types within a single platform.

Examples:
- Clinic Management
- Product / E-commerce CRM
- Generic Sales CRM
- ERP
- Custom Modules

Each tenant (company) selects ONE primary service type during setup.

---

## Core Concept

There is one core system.

Modules are enabled or disabled based on selected service type.

---

## Service Type Table

Table: service_types

Fields:
- id (uuid)
- name
- code
- description
- is_active

Examples:
- clinic
- ecommerce
- crm
- erp

---

## Company Table Update

companies table must include:

- service_type_id (foreign key)
- subscription_plan_id (nullable)
- status

---

## Service Type Rule

A company can only access modules that are enabled
for its service type.

Module visibility must be controlled at:

- Route level
- Policy level
- UI level
