# Formify

A visual form builder that generates production-ready React code.

> 🚧 **Work in progress** — actively developed.

## What is Formify?

Formify lets you design forms visually (drag, drop, configure) and instantly export the generated code with [React Hook Form](https://react-hook-form.com/) and [Zod](https://zod.dev/) validation.

Stop writing the same form boilerplate over and over again.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** as the build tool
- **MobX** for reactive state management in ViewModels
- **React Hook Form** + **Zod** for the generated form code
- **Tailwind CSS v4** for styling
- **Vitest** + **Testing Library** for testing

## Architecture

This project follows a **modular Clean Architecture** approach. Each module is self-contained and split into three layers:

```
src/
├── core/                          # Shared across modules
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
        │   ├── entities/          # Business models (immutable classes)
        │   ├── repositories/      # Repository interfaces (contracts)
        │   └── use-cases/         # Application actions
        └── data/
            ├── data-sources/      # External data (LocalStorage, API)
            └── repositories/      # Repository implementations
```

The **domain** never depends on **data** or **presentation** — only the inverse direction is allowed. This keeps business rules isolated from frameworks and infrastructure.

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

## Roadmap

- [x] Project setup (Vite + TS + Tailwind + Vitest)
- [x] Clean Architecture skeleton
- [x] Domain entities (`Field`, `Form`)
- [ ] Use cases (`AddField`, `RemoveField`, `MoveField`, `UpdateField`)
- [ ] LocalStorage persistence
- [ ] Drag-and-drop builder UI
- [ ] Code export (React Hook Form + Zod)
- [ ] Form preview
- [ ] Multiple forms management

## License

MIT © Ruben Delgado Pareja