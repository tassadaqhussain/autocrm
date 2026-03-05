# DataTables.net Design Guidelines

When creating or modifying DataTables in this project, ALWAYS adhere to following standard UI pattern, mirroring the classic DataTables.net layout:

## Layout Structure
*   **Wrapper**: A simple white card with a subtle 1px gray border (`bg-white border border-slate-200 rounded`). NO heavy shadows, NO huge rounded corners. Avoid `ring` utilities unless strictly necessary for focus states.
*   **Header row (`th`)**: Minimalist. Use font size 13px (`text-[13px]`), regular or semi-bold (`font-medium`), and a gray text color (like `text-slate-600`). Align text middle. Include faint sorting icons (like `ArrowUpDown` from lucide) next to the column titles. White background.
*   **Data rows (`td`)**: Font size 13px (`text-[13px]`), regular weight, gray text `text-slate-600`. Bottom borders only (`border-b border-slate-100`), not divided rows. No flashy hover states other than a very subtle `bg-slate-50`.
*   **Empty State**: When no data is present, simply show the text "No data available in table" in a single table cell spanning all columns. NO massive icons, NO huge padding. Keep it compact (`py-8 max`).
*   **Footer / Pagination**:
    *   Left side: A "Show [ 10 ] entries" dropdown element.
    *   Right side: A status text "Showing X to Y of Z entries" followed by simple bordered "Previous" and "Next" buttons (and page numbers if implemented).
    *   The footer should have a top border (`border-t border-slate-200`) and a white background. No fancy colored tags or glowing accents.

## Example Configuration
```tsx
const thClass = 'px-4 py-2.5 text-[13px] font-medium text-slate-600 border-b border-slate-200 bg-white align-middle whitespace-nowrap';
const tdClass = 'px-4 py-2.5 text-[13px] text-slate-600 border-b border-slate-100 align-middle';
```

## Note
These rules are established by the user to maintain a consistent, professional, data-dense look across all CRUD tables. Do not substitute this with "modern, overly-designed" equivalents with huge padding or flashy gradients.
