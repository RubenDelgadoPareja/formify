# Formify

A visual form builder that generates production-ready React code.

**Live demo:** https://formify-xi-umber.vercel.app

## What is Formify?

Formify lets you design forms visually and instantly export the generated component with [React Hook Form](https://react-hook-form.com/) and [Zod](https://zod.dev/) validation — ready to paste into any React project.

- Drag and drop fields to reorder them
- Configure label, type, required state, and options per field
- Start from a predefined template (Contact, Login, Billing Address, Payment)
- Copy the generated code to the clipboard with one click

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** as the build tool
- **MobX** for reactive ViewModel state
- **@dnd-kit** for drag-and-drop
- **React Hook Form** + **Zod** for the generated form code
- **Tailwind CSS v4** for styling
- **Vitest** + **Testing Library** for testing

## Architecture

Modular Clean Architecture with a strict inward dependency rule: data → presentation → domain. The domain layer has zero framework dependencies.

```
src/
├── core/                          # Shared infrastructure
│   └── presentation/
│       ├── hooks/                 # useViewModel, useDidMount, useWillUnmount
│       └── view-models/base/      # BaseViewModel
│
└── modules/
    └── form-builder/
        ├── presentation/
        │   ├── pages/             # Page components (Views)
        │   ├── view-models/       # Stateful logic (MobX classes)
        │   └── components/        # Reusable UI components
        ├── domain/
        │   ├── entities/          # Business models (immutable value objects)
        │   ├── repositories/      # Repository interfaces
        │   ├── services/          # CodeGeneratorService
        │   └── use-cases/         # Application actions
        └── data/
            ├── data-sources/      # LocalStorage adapter
            └── repositories/      # Repository implementations
```

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm 10 or higher

### Installation

```bash
git clone https://github.com/RubenDelgadoPareja/formify.git
cd formify
npm install
```

### Development

```bash
npm run dev          # Start the dev server at http://localhost:5173
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run lint         # Lint the codebase
npm run format       # Format with Prettier
npm run build        # Build for production
```

## License

MIT © Ruben Delgado Pareja
