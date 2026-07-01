# Custom Data Visualization Tool

A browser-based data visualization tool built for local businesses that track data in Excel spreadsheets and CSV files. Upload a file, preview the data, and build interactive charts — all without any data leaving your device.

## Features

- **File upload** — drag-and-drop or click to browse; supports `.xlsx`, `.xls`, and `.csv`
- **Data table** — paginated preview of all rows and columns
- **Summary stats** — instant cards showing row count, column count, column sum and average
- **Dashboard** — build and arrange multiple charts side by side
- **5 chart types** — Bar, Line, Area, Pie, Scatter
- **Multi-series support** — plot multiple columns on the same bar, line, or area chart
- **100% local** — files are parsed entirely in the browser; nothing is sent to a server

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Vite](https://vite.dev) | Build tool & dev server |
| [React 19](https://react.dev) | UI framework |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [Recharts](https://recharts.org) | Chart rendering |
| [SheetJS (xlsx)](https://sheetjs.com) | Excel file parsing |
| [PapaParse](https://www.papaparse.com) | CSV file parsing |
| [Lucide React](https://lucide.dev) | Icons |

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

The app runs at `http://localhost:5173` by default.

## Project Structure

```
src/
├── App.tsx                    # Main app shell (upload → table → dashboard flow)
├── types.ts                   # Shared TypeScript types
├── index.css                  # Global styles (Tailwind import)
├── utils/
│   └── parseFile.ts           # Excel and CSV parsing logic
└── components/
    ├── FileUpload.tsx          # Drag-and-drop file upload
    ├── DataTable.tsx           # Paginated data preview table
    ├── SummaryStats.tsx        # Summary stat cards
    ├── ChartBuilder.tsx        # Sidebar form to configure new charts
    └── ChartCard.tsx           # Renders individual charts via Recharts
```

## Usage

1. Open the app and upload an Excel or CSV file.
2. Review your data in the **Data Table** tab.
3. Switch to the **Dashboard** tab.
4. Use the sidebar to pick a chart type, select X and Y columns, and click **Add to Dashboard**.
5. Repeat to add more charts. Remove any chart with the × button.
6. Click **New file** in the header to start over with a different file.
