# Module UI Patterns

Apply these patterns consistently across **all modules** (Clients, Leads, Deals, HR Employees, and any future list/detail modules) for a unified UX.

---

## 0. Listing (table)

- **Use the shared `DataTable` component** for all entity list pages. Do not build custom `<table>` markup for list views.
- Define columns via `DataTableColumn<T>[]` (id, header, cell renderer, optional align/cellClassName). Pass `data`, `getRowId`, `emptyMessage`, optional `pagination`, and optional `renderActions(row)` for View/Edit/Delete.
- Keeps tables compact, consistent, and pagination/footer behaviour unified.

**Reference:** `resources/js/Components/DataTable.tsx`, `resources/js/Pages/Clients/Index.tsx`

---

## 1. List page toolbar

- **No inline filter bar** on the list page (no search input, status dropdown, or Apply button in the main toolbar).
- **Single “Filter” button** (with Filter icon) that opens a **filter drawer**.
- Filter drawer contains:
  - Search field (and any other filter fields, e.g. status).
  - Clear, Cancel, and “Apply filters” actions.
  - On Apply: submit filters (e.g. `router.get` with query params), then close the drawer.

**Reference:** `resources/js/Pages/Clients/Index.tsx` + `resources/js/Components/Clients/ClientFilterDrawer.tsx`

---

## 2. Add / Create

- **Drawer modal**, not a full-page create route.
- “Add [Entity]” in the header opens the drawer (e.g. “Add Client”).
- Drawer: same `Drawer` component, title, form sections, footer with Save, Save & Add More (if applicable), Cancel.
- Optional: support `?create=true` on the index URL to auto-open the create drawer.

**Reference:** `resources/js/Components/Clients/CreateClientDrawer.tsx`

---

## 3. View (show)

- **Drawer**, not a full-page show.
- Row action: **View** (e.g. eye icon) opens a **read-only drawer** with the same section layout as the form (Account Details, Company Details, etc.), labels + values, “—” for empty.
- Footer: Close, and **Edit** (which closes view drawer and opens edit drawer for the same entity).

**Reference:** `resources/js/Components/Clients/ShowClientDrawer.tsx`

---

## 4. Edit

- **Drawer**, not a full-page edit.
- Row action: **Edit** (e.g. pencil icon) opens the **edit drawer** with the same form as Create, pre-filled from the selected entity.
- Submit: PUT/PATCH to update route; on success close the drawer.
- Footer: Cancel, Update (no “Save & Add More” or “Magic Fill” unless desired).

**Reference:** `resources/js/Components/Clients/EditClientDrawer.tsx`

---

## 5. Table row actions

- **No dropdown menu** for row actions (dropdowns can be clipped by table overflow).
- Use **always-visible icon buttons** in the Action column: View (eye), Edit (pencil), Delete (trash).
- Same styling: rounded, hover states, optional tooltips/titles.

**Reference:** `resources/js/Pages/Clients/Index.tsx` (action column)

---

## 6. Shared types for drawer data

- For modules with add/view/edit drawers, define a **shared entity type** (e.g. `ClientDrawerClient`) that includes all fields returned by the list/detail API so the same shape is used for list rows, view drawer, and edit drawer.
- **Reference:** `resources/js/Components/Clients/ClientDrawerTypes.ts`

---

## 7. Checklist for a new module

When adding a new list/detail module (including HR Employees and any entity list):

- [ ] **Listing:** Use shared `DataTable` with column definitions; no custom table markup.
- [ ] Index page: toolbar with **only** a “Filter” button (no inline search/filters).
- [ ] Filter drawer component: search + filters + Apply/Clear/Cancel.
- [ ] **Add/Create:** Drawer modal only (no full-page create). “Add [Entity]” opens the create drawer.
- [ ] Create drawer: form in drawer; footer: Save, Save & Add More (if applicable), Cancel.
- [ ] View drawer: read-only, same sections; Edit button opens edit drawer.
- [ ] Edit drawer: same form as create, pre-filled; PUT on submit, then close.
- [ ] Table: View, Edit, Delete as **always-visible icon buttons** (no action dropdown).
- [ ] Shared entity type for list/drawer data if needed.

---

*Last updated: 2026-02-26. Reference implementation: Clients module.*
