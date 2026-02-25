# Module Activation System

Modules are not globally available.

Each service type enables specific modules.

---

## Example Module Mapping

Clinic:
- Patients
- Appointments
- Doctors
- Prescriptions
- Billing
- Inventory

E-commerce:
- Products
- Orders
- Customers
- Payments
- Shipping

CRM:
- Leads
- Deals
- Contacts
- Pipelines
- Tasks

ERP:
- Accounting
- HR
- Inventory
- Procurement
- Sales

---

## Required Tables

service_types
modules
service_type_modules

service_type_modules:
- id
- service_type_id
- module_name
- is_enabled

---

## Middleware Rule

Before accessing a module:

Check:
- Tenant service type
- Module enabled for that service type

If not allowed:
Return 403 Forbidden.
