# Fix Tailwind CSS Error

## Problem
Tailwind CSS v4 has breaking changes and requires `@tailwindcss/postcss` package.

## Solution
Downgrade to Tailwind CSS v3 which is compatible with Create React App.

## Steps to Fix

Run these commands in your terminal:

```bash
cd frontend
npm uninstall tailwindcss
npm install -D tailwindcss@^3.4.0
```

Then restart your dev server:
```bash
npm start
```

