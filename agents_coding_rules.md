# 🤖 Sedalang Frontend — AI Agent Coding Rules

This file contains the mandatory coding, architecture, styling, and development rules for AI coding agents working on the Sedalang Frontend project.

All AI agents, including Codex, MUST read and follow these rules before creating, modifying, moving, or deleting project files.

The primary goal is to keep the codebase clean, scalable, maintainable, type-safe, and consistent with modern Nuxt development practices.

---

# 1. 🛠️ Tech Stack

The project MUST use the following core technology stack and pinned stable versions.

These versions were verified on **22 August 2026** against npm's current `latest` stable tags:

- **Framework:** Nuxt `4.5.2`
- **UI Framework:** Vue `3.5.41`
- **Language:** TypeScript `7.0.2`
- **State Management:** Pinia `4.0.3`
- **Nuxt Pinia Integration:** `@pinia/nuxt` `1.0.2`
- **Styling:** Tailwind CSS `4.3.3`
- **Tailwind Vite Integration:** `@tailwindcss/vite` `4.3.3`
- **Package Manager:** npm

Nuxt `4.5.2` is the current stable npm release. citeturn0search0
Vue `3.5.41`, TypeScript `7.0.2`, and Pinia `4.0.3` are the current stable npm releases; pre-release versions MUST NOT be used. citeturn1search3turn1search0turn1search1
`@pinia/nuxt` `1.0.2` is the current package release. citeturn1search14
Tailwind CSS `4.3.3` with `@tailwindcss/vite` `4.3.3` is the required Tailwind integration. Tailwind's official Nuxt guide recommends installing `tailwindcss` and `@tailwindcss/vite` through npm and configuring the Vite plugin. citeturn0search3turn0search8

## Version Policy

The versions above are the project's pinned baseline.

The AI agent MUST:

1. Use these exact versions when installing or updating the core stack.
2. Keep the core stack mutually compatible.
3. NOT downgrade a pinned core dependency without explicit user approval.
4. NOT use beta, alpha, RC, nightly, `next`, `canary`, dev, or insider releases.
5. NOT silently upgrade a pinned dependency when a newer stable version becomes available.
6. Ask for explicit approval before changing the pinned versions in `AGENTS.md` and `package.json`.
7. Resolve dependency conflicts by checking official compatibility information before changing any pinned core version.

## Core Dependency Baseline

The expected core packages are:

```json
{
  "dependencies": {
    "nuxt": "4.5.2",
    "vue": "3.5.41",
    "pinia": "4.0.3"
  },
  "devDependencies": {
    "@pinia/nuxt": "1.0.2",
    "tailwindcss": "4.3.3",
    "@tailwindcss/vite": "4.3.3",
    "typescript": "7.0.2"
  }
}
```

Use the dependency section appropriate to the generated Nuxt project. Do not blindly move packages between `dependencies` and `devDependencies` when the Nuxt generator or package conventions require otherwise.

## Mandatory Rules
# 2. 🚫 No CDN — STRICT RULE

CDN usage is strictly prohibited.

NEVER use:

- Tailwind CSS CDN
- Vue CDN
- JavaScript CDN
- CSS CDN
- External `<script src="...">` dependencies
- External stylesheet dependencies loaded directly through `<link>`
- `https://cdn.tailwindcss.com`
- Any CDN-based dependency for application functionality

All project dependencies MUST be installed locally through npm and declared in `package.json`.

For example, NEVER do:

```
<script src="https://cdn.tailwindcss.com"></script>

```

or:

```
<link rel="stylesheet" href="https://cdn.example.com/...">

```

Use local npm dependencies and Nuxt/Tailwind configuration instead.

Before introducing any external dependency, determine whether the functionality can be implemented using the existing stack.

---

# 3. 📁 Project Architecture

The project follows the Nuxt `app/` directory structure.

Application-specific frontend code MUST live inside `app/`.

Expected structure:

```
project-root/
├── AGENTS.md
├── app/
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   ├── middleware/
│   ├── pages/
│   ├── plugins/
│   ├── stores/
│   ├── types/
│   └── utils/
│
├── public/
├── server/
├── nuxt.config.ts
├── package.json
├── tsconfig.json
└── ...

```

Do NOT create duplicate application directories at the project root.

Avoid creating:

```
components/
composables/
layouts/
middleware/
plugins/
stores/
types/
utils/

```

outside `app/`.

---

# 4. 📂 Directory Responsibilities

## `app/pages/`

Responsible for application routes and page-level UI.

Examples:

```
app/pages/
├── index.vue
├── about.vue
└── dashboard/
    └── index.vue

```

Pages should primarily compose components and page-specific logic.

Do not place large reusable UI components directly inside pages.

---

## `app/components/`

Contains reusable Vue components.

Examples:

```
app/components/
├── ui/
├── common/
└── features/

```

Possible organization:

```
components/
├── ui/
│   ├── Button.vue
│   ├── Modal.vue
│   └── Input.vue
│
├── common/
│   ├── Navbar.vue
│   └── Footer.vue
│
└── features/
    └── ...

```

Do not create unnecessary subdirectories.

Components should have a clear and focused responsibility.

---

## `app/composables/`

Contains reusable Vue/Nuxt composables.

Examples:

```
app/composables/
├── useAuth.ts
├── useUser.ts
└── useSomething.ts

```

Use composables for reusable application logic that does not belong directly inside a component.

Prefer composables over duplicating the same logic across multiple components.

---

## `app/layouts/`

Contains Nuxt layouts.

Examples:

```
app/layouts/
├── default.vue
└── dashboard.vue

```

Layouts are responsible for structural page-level UI such as:

- Navbar
- Sidebar
- Footer
- Main content containers

Do not put feature-specific business logic into layouts unless necessary.

---

## `app/middleware/`

Contains Nuxt route middleware.

Examples:

```
app/middleware/
├── auth.ts
└── guest.ts

```

Use middleware for route-level access/control logic.

Do not use middleware for unrelated business logic.

---

## `app/plugins/`

Contains Nuxt plugins.

Use plugins only when functionality needs to be registered with Nuxt/Vue at application initialization.

Do not create plugins unnecessarily.

Before creating a plugin, check whether the functionality can be implemented using:

- composables
- components
- Nuxt modules
- normal utilities

---

## `app/stores/`

Contains Pinia stores.

Example:

```
app/stores/
├── auth.ts
├── user.ts
└── ...

```

Use Pinia when state needs to be shared across multiple components/pages.

Do NOT automatically put every piece of state into Pinia.

Use local component state for state that is only relevant to one component.

---

## `app/types/`

Contains shared TypeScript types and interfaces.

Examples:

```
app/types/
├── user.ts
├── product.ts
└── api.ts

```

Types should be reused instead of repeatedly defining the same structure in different files.

Avoid unnecessary duplication of interfaces.

---

## `app/utils/`

Contains reusable pure utility/helper functions.

Examples:

```
app/utils/
├── formatDate.ts
├── formatCurrency.ts
└── ...

```

Utilities should generally be:

- predictable
- reusable
- independent from UI
- easy to test

Do not place Vue component logic inside `utils/`.

---

# 5. 🧩 Nuxt & Vue Architecture Rules

Use Vue 3 Composition API.

Preferred component structure:

```
<script setup lang="ts">
// imports
// types
// props
// emits
// state
// computed
// functions
// watchers
</script>

<template>
  <!-- UI -->
</template>

<style scoped>
/* Only when Tailwind cannot reasonably solve the requirement */
</style>

```

Prefer:

```
<script setup lang="ts">

```

over the Options API unless there is a specific reason not to.

Do not introduce unnecessary Vue APIs.

---

# 6. 🧠 State Management — Pinia

Pinia is the project's state management solution.

Use Pinia for:

- authentication state
- user/session state
- shared application state
- state accessed by multiple unrelated components
- persistent application-level state when required

Do NOT use Pinia for:

- simple local component state
- temporary form input state
- UI state that belongs to a single component

Prefer local state:

```
const isOpen = ref(false)

```

when the state does not need to be shared.

Use a Pinia store when the state has application-wide responsibility.

---

# 7. 🎨 Styling — Tailwind CSS

Tailwind CSS is the primary styling solution.

Use Tailwind utility classes consistently.

Example:

```
<template>
  <button
    class="rounded-lg px-4 py-2 font-medium transition hover:opacity-90"
  >
    Submit
  </button>
</template>

```

## Rules

- Prefer Tailwind utilities.
- Keep styling close to the component when appropriate.
- Use responsive utilities.
- Follow a mobile-first approach.
- Avoid unnecessary custom CSS.
- Avoid creating large global CSS files.
- Do not use inline `style=""` unless there is a genuine dynamic-style requirement.
- Do not introduce another CSS framework.

Use responsive breakpoints appropriately:

```
sm:
md:
lg:
xl:
2xl:

```

Do not design only for desktop.

Every significant UI implementation should consider:

- mobile
- tablet
- desktop

---

# 8. 📱 Responsive Design

All UI must be responsive by default.

Use a mobile-first approach.

Example:

```
mobile
  ↓
sm
  ↓
md
  ↓
lg
  ↓
xl

```

Avoid hardcoded dimensions that unnecessarily break responsive layouts.

Do not assume the application will only be viewed at one screen size.

When implementing a design from a reference image, reproduce the visual hierarchy while keeping the layout responsive.

---

# 9. ✍️ Naming Conventions

## Variables

Use `camelCase`.

Correct:

```
const isModalOpen = ref(false)
const userProfile = ref(null)
const selectedProduct = ref(null)

```

Incorrect:

```
const is_modal_open = ref(false)
const UserProfile = ref(null)
const selected_product = ref(null)

```

---

## Functions

Use `camelCase`.

Correct:

```
function handleSubmit() {}

function fetchUserProfile() {}

function formatCurrency() {}

```

Incorrect:

```
function HandleSubmit() {}

function fetch_user_profile() {}

```

---

## Vue Components

Use `PascalCase`.

Correct:

```
UserCard.vue
ProductCard.vue
Navbar.vue
HeroSection.vue

```

Avoid:

```
user-card.vue
product_card.vue
navbar_component.vue

```

---

## Composables

Use the `use` prefix and camelCase.

Correct:

```
useAuth.ts
useUser.ts
useProducts.ts

```

Functions should follow:

```
useAuth()
useUser()
useProducts()

```

---

## Pinia Stores

Use clear store names.

Examples:

```
auth.ts
user.ts
cart.ts
product.ts

```

Store definitions should use descriptive names such as:

```
useAuthStore()
useUserStore()
useCartStore()

```

---

## Types & Interfaces

Use `PascalCase`.

Examples:

```
interface UserProfile {}

interface Product {}

type ProductStatus = 'active' | 'inactive'

```

---

# 10. 🔤 TypeScript Rules

TypeScript is mandatory.

Do NOT use JavaScript for application logic unless explicitly required by a third-party configuration.

Use:

```
.ts
.vue

```

Avoid:

```
.js

```

for application code.

## Strict Type Safety

Avoid `any`.

Do NOT use:

```
const data: any = ...

```

unless there is an exceptional technical reason and the reason is documented.

Prefer explicit types:

```
const data: UserProfile = ...

```

or inferred types when TypeScript can safely infer them.

Use:

- interfaces
- type aliases
- generics
- unions
- utility types

when appropriate.

Do not disable TypeScript checking to hide errors.

---

# 11. 🔄 Data Mapping

The frontend should use consistent `camelCase` naming.

If an API or external data source returns `snake_case`, transform the data before using it throughout the application.

For example:

```
API Response
────────────────────
user_id
first_name
last_name
avatar_url
created_at

Frontend Model
────────────────────
userId
firstName
lastName
avatarUrl
createdAt

```

Do not allow inconsistent naming to spread throughout the frontend.

Perform data transformation at the appropriate boundary, such as:

- API/composable layer
- data-mapping utility
- service/helper layer

Avoid repeatedly transforming the same data in UI components.

---

# 12. 🌐 API & Data Fetching

Do not place complex API/data-fetching logic directly inside UI components.

Prefer:

```
Component
    ↓
Composable
    ↓
API / Server

```

For example:

```
app/components/
        ↓
app/composables/useProducts.ts
        ↓
server/api/

```

Use Nuxt's built-in data-fetching capabilities where appropriate.

Before introducing an external HTTP client library, check whether Nuxt's existing functionality is sufficient.

Do not install Axios or another HTTP client automatically.

Only add it if explicitly required.

---

# 13. 🖥️ Server & API

If the project requires backend/API endpoints within the Nuxt application, use the Nuxt `server/` directory and its conventions.

Example:

```
server/
├── api/
├── middleware/
├── routes/
└── utils/

```

Keep server-side code separate from client-side application code.

Do not import server-only modules into client-side components.

Never expose server secrets to the client.

---

# 14. 🔐 Environment Variables & Secrets

Never hardcode:

- API keys
- secret keys
- tokens
- passwords
- private credentials
- production secrets
- private service URLs

Use environment variables through Nuxt's runtime configuration.

Sensitive server-only values must NOT be exposed through public runtime configuration.

Never commit `.env` files containing secrets.

Use `.env.example` when documentation of required variables is needed.

---

---

# 15. 🧱 Component Design & Reusability

The project MUST prioritize reusable components.

Before creating a new component, the AI agent MUST inspect the existing `app/components/` directory and determine whether an existing component can be reused, extended, or composed.

## Core Principle

> **Reuse existing components whenever possible. Do NOT recreate a component that already exists or can reasonably be reused.**

Before creating a new component, the AI agent MUST:

1. Inspect `app/components/`.
2. Search for an existing component with similar functionality.
3. Determine whether the existing component can be reused directly.
4. Determine whether the existing component can be extended using props, slots, or emits.
5. Only create a new component if an existing component cannot reasonably satisfy the requirement.

Do not create duplicate components simply because the component is being used on a different page or feature.

---

## Component Directory Structure

Reusable components MUST be organized inside:

```text
app/components/
├── ui/
├── features/
└── layouts/
```

The structure may be expanded when the project grows, but components should always have a clear responsibility.

---

## `app/components/ui/`

Contains generic, reusable UI primitives and atomic components.

Examples:

```text
app/components/ui/
├── Button.vue
├── Input.vue
├── Select.vue
├── Checkbox.vue
├── Modal.vue
├── Card.vue
├── Badge.vue
├── Dropdown.vue
├── Alert.vue
└── Spinner.vue
```

These components MUST be designed to be reusable across multiple pages and features.

Examples:

```vue
<Button />
<Card />
<Modal />
<Input />
<Badge />
```

Do NOT create feature-specific business logic inside `ui/` components.

For example, avoid:

```text
app/components/ui/UserCheckoutButton.vue
```

if the component contains business-specific checkout logic.

Instead, keep generic UI components generic:

```text
app/components/ui/Button.vue
```

and place feature-specific components inside `features/`.

---

## `app/components/features/`

Contains reusable components that belong to a specific application feature or module.

Examples:

```text
app/components/features/
├── auth/
├── dashboard/
├── product/
└── profile/
```

Example:

```text
app/components/features/product/
├── ProductCard.vue
├── ProductList.vue
├── ProductFilter.vue
└── ProductDetail.vue
```

Feature components may contain feature-specific presentation and interaction logic.

However, reusable generic UI elements should remain inside:

```text
app/components/ui/
```

when they are not tied to a specific feature.

---

## `app/components/layouts/`

Contains reusable structural components used throughout the application.

Examples:

```text
app/components/layouts/
├── Navbar.vue
├── Sidebar.vue
├── Footer.vue
├── Header.vue
└── PageContainer.vue
```

These components are responsible for application-wide or section-wide layout structures.

Do not duplicate Navbar, Sidebar, Footer, or similar structural components across pages.

If the same structural component is required in multiple places, reuse the existing component.

---

# Component Reuse Rules

## Rule 1 — Always Search Before Creating

Before creating any component such as:

```text
Button.vue
Card.vue
Modal.vue
Input.vue
Navbar.vue
Sidebar.vue
Footer.vue
```

or any similar component, inspect:

```text
app/components/
```

first.

The AI agent must not assume that a component does not exist.

---

## Rule 2 — Reuse Existing Components

If an existing component satisfies the requirement, use it.

For example, if:

```text
app/components/ui/Button.vue
```

already exists, do NOT create:

```text
app/components/ui/SubmitButton.vue
app/components/ui/LoginButton.vue
app/components/ui/RegisterButton.vue
```

when the only difference is text, styling variant, or behavior that can reasonably be handled through props, slots, or emits.

Instead:

```vue
<Button>
  Submit
</Button>
```

or:

```vue
<Button variant="primary">
  Register
</Button>
```

---

## Rule 3 — Extend Before Duplicating

If an existing component is almost suitable but needs additional functionality, determine whether it can be extended using:

- props
- slots
- emits
- variants
- composables

before creating a completely new component.

For example:

```vue
<Button
  variant="primary"
  size="lg"
  :loading="isSubmitting"
>
  Submit
</Button>
```

is preferred over creating:

```text
SubmitButton.vue
LargeSubmitButton.vue
LoadingSubmitButton.vue
```

when the differences can reasonably be handled by the reusable Button component.

---

## Rule 4 — Avoid Over-Generalization

Do NOT force unrelated components into one generic component.

Do not create:

```text
UniversalComponent.vue
EverythingCard.vue
MegaButton.vue
```

just to avoid creating separate components.

A component should be reusable because its responsibility is genuinely reusable, not because everything must be placed into one component.

---

# Component Responsibility

Components should generally follow this hierarchy:

```text
Page
  ↓
Feature Component
  ↓
Reusable UI Component
```

Example:

```text
app/pages/products/index.vue
        ↓
app/components/features/product/ProductList.vue
        ↓
app/components/features/product/ProductCard.vue
        ↓
app/components/ui/Card.vue
app/components/ui/Badge.vue
app/components/ui/Button.vue
```

This structure allows pages to remain clean while maximizing component reuse.

---

# Component Naming

Vue components MUST use PascalCase.

Correct:

```text
Button.vue
ProductCard.vue
ProductList.vue
Navbar.vue
UserProfile.vue
```

Avoid:

```text
button.vue
product-card.vue
product_card.vue
```

---

# Props, Slots & Emits

Reusable components should expose appropriate customization through:

- Props
- Slots
- Emits

Example:

```vue
<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>
```

Use slots when the component needs flexible content.

Example:

```vue
<Card>
  <template #header>
    ...
  </template>

  ...
</Card>
```

Use emits for component events.

Example:

```ts
const emit = defineEmits<{
  submit: []
  cancel: []
}>()
```

Do not tightly couple generic UI components to application-specific data.

---

# Component Duplication Audit

Before finishing a feature, the AI agent SHOULD review the created components and check:

- Is this component already present?
- Is another component doing almost the same thing?
- Can this component be moved into `ui/`?
- Can an existing component be extended instead?
- Is the component feature-specific?
- Is the component actually reusable?

If two components have nearly identical responsibilities, prefer consolidating them when it does not introduce unnecessary complexity.

---

# Reuse Existing Components in New Pages

When implementing a new page, the AI agent MUST reuse existing components whenever applicable.

For example, if the project already contains:

```text
app/components/layouts/Navbar.vue
app/components/layouts/Footer.vue
app/components/ui/Button.vue
app/components/ui/Card.vue
```

a new page should reuse these components instead of recreating their markup and styling.

Do NOT copy and paste an existing component's implementation into a new file just to modify it slightly.

Instead, determine whether the existing component can support the new use case through props, slots, variants, or composition.

---

# Component Creation Decision Process

Before creating a new component, follow this process:

```text
Need a component
      ↓
Search app/components/
      ↓
Existing component?
      │
   ┌──┴──┐
   │     │
  YES    NO
   │     │
   ↓     ↓
Reuse   Can existing component
        be extended?
          │
       ┌──┴──┐
       │     │
      YES    NO
       │     │
       ↓     ↓
    Extend  Create new component
```

The default decision MUST be:

> **Reuse first. Extend second. Create new only when necessary.**

---

# Important Restrictions

The AI agent MUST NOT:

- Create duplicate UI components.
- Copy an existing component into another folder without a clear architectural reason.
- Create page-specific versions of generic UI components unnecessarily.
- Create multiple components with nearly identical responsibilities.
- Rebuild an existing Button, Card, Modal, Input, Navbar, Sidebar, Footer, or similar component without first inspecting the existing implementation.
- Create a new component simply because the existing component requires different text.
- Create a new component simply because the existing component requires a different size, color, or variant if those differences can reasonably be handled through props or variants.

The AI agent SHOULD prefer:

```text
Reuse
  ↓
Extend
  ↓
Compose
  ↓
Create new
```

in that order.

---

# Final Component Rule

The AI agent must treat `app/components/` as a shared component library for the project.

Whenever a reusable component is created, place it in the appropriate directory so that future pages and features can reuse it.

Whenever a reusable component already exists, use that component instead of creating another implementation.

**Do not duplicate reusable components.**

**Build once, reuse everywhere.**

---

# 16. 🚫 No Business Logic in Pure UI Components

Pure UI components should primarily handle:

- presentation
- layout
- user interaction
- emitting events
- receiving props

Avoid placing complex business logic directly inside them.

Instead, move reusable/complex logic to:

```
app/composables/
app/stores/
app/utils/

```

depending on the responsibility.

---

# 17. 📝 Forms & User Input

Use Vue/Nuxt form patterns appropriate to the project.

Do NOT introduce React Hook Form.

Do NOT introduce React-specific libraries.

For simple forms, Vue's normal reactive state is sufficient.

Example:

```
const form = reactive({
  name: '',
  email: '',
})

```

For complex forms, reusable form composables or a validation library may be introduced only when there is a clear requirement.

Do not install a validation library automatically.

Always provide appropriate:

- validation feedback
- loading state
- error state
- success feedback

---

# 18. ♿ Accessibility

Accessibility must be considered in every UI implementation.

Use semantic HTML whenever possible.

Prefer:

```
<button>
<a>
<nav>
<header>
<main>
<section>
<footer>

```

over generic `<div>` elements when semantics apply.

Interactive elements must be keyboard accessible.

Provide appropriate:

- `aria-label`
- `aria-expanded`
- `aria-describedby`
- `alt`
- form labels

when required.

Do not use clickable `<div>` elements when a `<button>` or `<a>` is appropriate.

Images should have meaningful `alt` text when the image conveys information.

Decorative images may use an empty alt attribute where appropriate.

---

# 19. ⏳ Loading, Empty & Error States

Every data-driven UI should consider:

### Loading

Examples:

- Skeleton
- Spinner
- Disabled submit button
- Loading text

### Empty

Examples:

```
No products found.
No notifications yet.
No data available.

```

### Error

Display a useful error message.

Avoid silently failing.

For example:

```
Failed to load products.
Please try again.

```

Do not expose sensitive internal errors to users.

---

# 20. 🧹 Clean Code Rules

The AI agent MUST:

- Keep functions focused.
- Avoid duplicated code.
- Remove unused imports.
- Remove unused variables.
- Avoid unnecessary dependencies.
- Avoid unnecessary abstractions.
- Prefer simple solutions.
- Follow existing project conventions.
- Reuse existing components/utilities before creating new ones.

Do not refactor unrelated code while implementing a feature.

Keep changes focused on the requested task.

---

# 21. 📦 Dependency Rules

Before installing a new dependency:

1. Check whether Nuxt already provides the functionality.
2. Check whether Vue provides the functionality.
3. Check whether the existing project dependencies provide it.
4. Only then consider installing a new package.

Do NOT install packages merely because they are popular.

Do NOT add:

- React
- Next.js
- Bootstrap
- jQuery
- another CSS framework
- another state-management library
- unnecessary UI frameworks

without explicit user approval.

The core frontend stack must remain:

```
Nuxt
Vue
TypeScript
Pinia
Tailwind CSS

```

---

# 22. 🔍 Before Modifying Code

Before making changes, the AI agent MUST:

1. Inspect the relevant existing files.
2. Understand the current implementation.
3. Check whether reusable components/composables/stores already exist.
4. Check the existing project architecture.
5. Avoid creating duplicate functionality.
6. Determine the smallest clean change required.

Do not immediately create new files without inspecting the existing codebase.

---

# 23. 🛑 Avoid Unnecessary Changes

When implementing a requested feature:

DO NOT:

- rewrite unrelated files
- change the project's framework
- replace existing dependencies without reason
- restructure the entire application
- change Tailwind configuration unnecessarily
- modify Git configuration unnecessarily
- remove working code without justification

Make the smallest safe change that properly solves the requested problem.

---

# 24. 🧪 Verification

After implementing a significant change, verify the project.

At minimum, when appropriate, run:

```
npm run build

```

If a development server is needed:

```
npm run dev

```

Check for:

- TypeScript errors
- Nuxt errors
- Vue template errors
- broken imports
- missing components
- invalid routes
- Tailwind compilation problems
- runtime errors

Do not claim that an implementation is complete if it has known build or type errors.

---

# 25. 🔎 CDN Audit

The AI agent MUST ensure that the project does not contain CDN-based dependencies.

Before completing a relevant task, check for suspicious references such as:

```
cdn
cdn.
tailwindcss.com
<script src="http
<link href="http

```

The project MUST use locally installed npm dependencies.

---

# 26. 🎯 Feature Development Workflow

When the user requests a new feature, follow this workflow:

```
1. Understand the requirement
        ↓
2. Inspect existing project
        ↓
3. Identify reusable code
        ↓
4. Plan the implementation
        ↓
5. Implement the smallest clean solution
        ↓
6. Verify TypeScript / Nuxt / build
        ↓
7. Review the implementation
        ↓
8. Report what changed

```

Do not start coding before understanding the existing architecture.

---

# 27. 🤖 AI Agent Behavior

The AI agent should behave like a senior frontend engineer.

The agent should:

- inspect before modifying
- reason before creating
- reuse before duplicating
- type before using `any`
- use Nuxt conventions
- use Tailwind consistently
- use Pinia appropriately
- keep UI components focused
- keep business logic separated
- avoid unnecessary dependencies
- verify changes before finishing

The agent should NOT:

- blindly follow outdated tutorials
- introduce React patterns
- introduce Next.js patterns
- introduce unnecessary libraries
- use CDN dependencies
- create unnecessary files
- rewrite working code without reason
- ignore TypeScript errors
- hide errors by disabling type checking

---

---

---

---

# 29. 🎨 Design-to-Code & High-Fidelity Image Slicing

When the user provides a design reference, screenshot, mockup, wireframe, or UI image, the AI agent MUST treat the provided visual as the primary visual source of truth.

The goal is to reproduce the provided design as accurately as reasonably possible using the project's existing Nuxt, Vue, TypeScript, and Tailwind CSS stack.

The AI agent MUST prioritize visual fidelity over personal design preferences.

Do NOT redesign the provided interface unless explicitly requested by the user.

---

# 29.1 🔍 Design Analysis Before Coding

The AI agent MUST NOT immediately start writing code after receiving a design image.

Before implementation, analyze the visual reference carefully.

Identify:

- overall page structure
- viewport dimensions/aspect ratio if known
- header/navbar structure
- hero sections
- content sections
- cards
- grids
- columns
- containers
- buttons
- forms
- navigation
- footer
- images
- icons
- typography
- spacing
- padding
- margins
- border radius
- borders
- shadows
- colors
- gradients
- background elements
- overlays
- positioning
- alignment
- visual hierarchy
- responsive behavior when it can be inferred

Create an internal implementation plan before coding.

Do not make arbitrary design decisions when the reference already provides enough visual information.

---

# 29.2 🎯 Visual Source of Truth

When a design image is provided:

> **The provided design is the visual source of truth.**

Do not replace the design with a generic interpretation.

For example, if the reference shows:

- a specific spacing
- a specific card width
- a specific border radius
- a specific font size
- a specific image position
- a specific alignment
- a specific section height

the implementation should reproduce those characteristics as closely as possible.

Do not change them simply because another design approach looks better.

---

# 29.3 📐 Layout Analysis

Before implementing a page, determine the layout system visible in the reference.

Analyze:

- maximum content width
- page margins
- horizontal padding
- section spacing
- grid columns
- column gaps
- element alignment
- vertical rhythm
- content hierarchy
- relative element sizes

Prefer CSS layout systems appropriate to the design:

- Flexbox
- CSS Grid
- absolute positioning only when genuinely required

Do NOT use excessive absolute positioning to reproduce a static screenshot if the design can be implemented correctly with normal responsive layout techniques.

Avoid hardcoding every element's position using arbitrary pixel offsets.

The goal is to reproduce the visual result while maintaining a robust responsive implementation.

---

# 29.4 📏 Spacing & Dimensions

Pay close attention to:

- padding
- margin
- gap
- width
- height
- max-width
- min-height
- line-height
- element spacing

Do not use arbitrary spacing values without first considering the visual reference.

When the exact value cannot be determined, choose the closest reasonable value and keep the implementation consistent.

Prefer Tailwind utility classes.

If a custom value is genuinely required for visual accuracy, use Tailwind's arbitrary values appropriately.

Example:

```
max-w-[1180px]
gap-[22px]
rounded-[18px]

```

Do not approximate a clearly visible design value with a substantially different standard utility merely because it is easier to write.

---

# 29.5 🎨 Colors

Analyze the reference for:

- primary colors
- secondary colors
- background colors
- text colors
- muted text
- borders
- accents
- gradients
- overlays

Use the closest possible color values.

Do not arbitrarily replace the design colors with default Tailwind colors.

If a specific color is clearly visible in the reference, preserve it.

If the project has an established design system, reuse the existing design tokens when they match the reference.

Do not introduce a new color system unnecessarily.

---

# 29.6 🔤 Typography

Typography is a major part of visual accuracy.

Analyze:

- font family
- font size
- font weight
- line height
- letter spacing
- text transformation
- text alignment
- text width
- text wrapping

If the reference uses a specific font and the project already provides it, use the existing project font.

If the font is unknown, do not falsely claim that the exact font has been identified.

Choose the closest available alternative.

Typography should be implemented intentionally rather than relying entirely on browser defaults.

Example:

```
font-size
font-weight
line-height
letter-spacing

```

must be considered when reproducing headings, paragraphs, buttons, labels, and navigation.

---

# 29.7 🖼️ Image & Asset Analysis

Before using placeholder images, inspect the project assets.

Check:

```
public/
assets/

```

and existing image resources.

If the correct asset already exists, reuse it.

Do NOT create a duplicate asset.

Do NOT replace a provided design asset with a generic placeholder if the correct asset is available.

When an image is visible in the reference but the actual asset is unavailable:

1. Check whether a similar project asset exists.
2. If not available, use an appropriate placeholder only when necessary.
3. Do not pretend that the placeholder is the original asset.
4. Keep the image dimensions, aspect ratio, object-fit, and positioning consistent with the reference.

---

# 29.8 🧩 Identify Reusable Components

Before creating components from a design, identify reusable UI patterns.

For example:

```
Navbar
Button
Card
Input
Badge
Modal
SectionHeader
Footer

```

Check:

```
app/components/

```

before creating a new component.

Follow the project's reusable component rules.

Reuse existing components whenever possible.

If the design introduces a genuinely reusable component, create it in the appropriate location:

```
app/components/ui/
app/components/features/
app/components/layouts/

```

Do NOT duplicate existing components.

---

# 29.9 🏗️ Design-to-Component Breakdown

Break the design into logical components.

For example:

```
Page
├── Navbar
├── HeroSection
│   ├── HeroContent
│   └── HeroImage
├── FeatureSection
│   └── FeatureCard
├── CTASection
└── Footer

```

Avoid creating one enormous Vue component containing the entire page.

However, do NOT over-componentize simple markup.

Create components when they provide:

- reuse
- clear responsibility
- maintainability
- feature isolation
- visual consistency

---

# 29.10 📱 Responsive Design Inference

A screenshot represents a specific viewport.

Do not assume that the exact screenshot dimensions are the only supported viewport.

When implementing a design:

1. Reproduce the reference viewport accurately.
2. Infer reasonable responsive behavior.
3. Preserve the visual hierarchy at smaller screen sizes.
4. Use mobile-first Tailwind utilities.
5. Avoid breaking the desktop design while implementing mobile behavior.

If multiple reference images are provided for different viewport sizes, treat all of them as visual sources of truth.

Use the references to infer responsive behavior rather than inventing a completely different layout.

---

# 29.11 🖥️ Viewport Accuracy

When the reference image has known dimensions, consider those dimensions when implementing and validating the layout.

For example:

```
Reference:
1440 × 900

```

The AI agent should consider:

- content width
- viewport padding
- section heights
- image dimensions
- text wrapping
- vertical alignment

relative to the reference viewport.

Do not optimize only for arbitrary default browser dimensions.

---

# 29.12 🔄 Visual Validation Loop

After implementing a design, the AI agent MUST perform a visual review.

The workflow should be:

```
Reference Image
      ↓
Implementation
      ↓
Render Page
      ↓
Compare
      ↓
Identify Differences
      ↓
Adjust
      ↓
Render Again
      ↓
Final Comparison

```

Do not consider a design implementation finished simply because:

```
npm run build

```

passes.

A successful build only confirms that the code compiles.

It does NOT confirm visual accuracy.

---

# 29.13 🔎 Visual Comparison Checklist

When comparing the implementation with the reference, inspect:

## Layout

- Is the overall structure correct?
- Is the content positioned correctly?
- Are sections the correct height?
- Are columns aligned?
- Is the container width correct?

## Spacing

- Is the padding correct?
- Are margins correct?
- Are gaps between elements correct?
- Is vertical rhythm consistent?

## Typography

- Is the font size correct?
- Is the font weight correct?
- Is line-height correct?
- Does the text wrap at the same locations?
- Is the text width similar?

## Components

- Are buttons the correct size?
- Are cards the correct dimensions?
- Are borders correct?
- Are border radii correct?
- Are shadows correct?

## Colors

- Are backgrounds correct?
- Are text colors correct?
- Are borders correct?
- Are gradients correct?

## Images

- Correct image?
- Correct aspect ratio?
- Correct size?
- Correct object-fit?
- Correct positioning?

## Responsive Behavior

- Does the page remain usable on smaller screens?
- Does the layout collapse appropriately?
- Are elements hidden or stacked appropriately?
- Does the design maintain its visual hierarchy?

---

# 29.14 🚫 Do Not Guess When Evidence Exists

If the design clearly provides visual information, do not invent a different implementation.

Avoid statements or assumptions such as:

```
"This probably uses a 1200px container."
"This probably uses a 24px radius."
"This probably uses a blue Tailwind color."

```

Instead, inspect the visual carefully and choose values that most closely reproduce the reference.

When exact information cannot be determined from the image, use a reasonable approximation and keep it consistent.

---

# 29.15 🚫 Do Not Overfit With Excessive Hardcoding

High visual fidelity does NOT mean positioning every element with absolute coordinates.

Avoid implementations like:

```
left: 173px;
top: 247px;
width: 384px;

```

for every element.

Prefer:

- flexbox
- grid
- max-width containers
- gap
- padding
- margin
- responsive breakpoints

Use absolute positioning only when it represents the actual design structure.

Examples where absolute positioning may be appropriate:

- decorative background elements
- badges
- overlays
- floating buttons
- intentionally layered visual elements

---

# 29.16 🎯 Pixel Accuracy Priority

When implementing a provided design, prioritize the following order:

```
1. Overall layout
2. Element positioning
3. Container dimensions
4. Typography
5. Spacing
6. Colors
7. Images/assets
8. Borders/radius/shadows
9. Responsive behavior
10. Micro-interactions

```

Do not spend significant effort on animations before the static visual implementation is accurate.

The static design must be correct first.

---

# 29.17 🧠 Do Not Redesign

The AI agent MUST NOT:

- redesign the UI
- change the layout
- change the color palette
- replace typography
- change spacing unnecessarily
- add UI elements that do not exist in the reference
- remove UI elements from the reference
- change the visual hierarchy

unless explicitly requested by the user.

The AI agent's job is to implement the provided design, not reinterpret it.

---

# 29.18 🧪 Final Design QA

Before reporting a design task as complete, verify:

- The page renders successfully.
- The layout matches the reference.
- Components are reused where appropriate.
- No unnecessary duplicate components exist.
- Tailwind CSS is used consistently.
- No CDN dependencies were introduced.
- TypeScript has no known errors.
- Images use the correct assets where available.
- Responsive behavior is implemented.
- No unrelated files were modified.
- The final visual implementation has been reviewed against the reference.

A design task is NOT considered complete merely because the code builds.

It is complete when the implementation has been visually reviewed and significant discrepancies have been corrected.

---

# 30. 🚨 Critical Rules Summary

The following rules have the highest priority:

1. **Nuxt 4.5.2 + Vue 3.5.41 + TypeScript 7.0.2 is the framework foundation.**
2. **Pinia 4.0.3 is the state-management solution.**
3. **Tailwind CSS 4.3.3 is the primary styling solution.**
4. **No CDN under any circumstances.**
5. **Application code belongs inside** **`app/`****.**
6. **Use Composition API and** **`<script setup lang="ts">`****.**
7. **Avoid** **`any`****.**
8. **Do not introduce React/Next.js patterns.**
9. **Do not introduce unnecessary dependencies.**
10. **Inspect existing code before modifying it.**
11. **Keep business logic out of pure UI components.**
12. **Use composables for reusable logic.**
13. **Use Pinia only for shared application state.**
14. **Use Tailwind with responsive/mobile-first design.**
15. **Verify important changes with the appropriate Nuxt/build checks.**
16. **Never expose secrets or hardcode credentials.**
17. **Do not modify unrelated code.**
18. **Reuse existing components before creating new ones.**
19. **Extend or compose existing components before duplicating them.**
20. **Treat provided design images as the visual source of truth.**
21. **Analyze the design before coding and perform a visual validation loop after implementation.**
22. **Prioritize high visual fidelity without relying on excessive absolute positioning or brittle hardcoding.**

# 31. 🔌 API Integration & `docs_api.md`

All API integrations MUST follow the project's API documentation.

## Mandatory API Documentation Rule

Whenever the AI agent needs to:

- call an API
- create or modify an API request
- add or modify an endpoint integration
- modify request parameters or headers
- modify authentication
- modify request/response handling
- create API-related composables, services, utilities, or stores
- connect a page, component, or store to an API

the AI agent MUST FIRST read:

```text
docs_api.md

These rules are mandatory unless the user explicitly instructs otherwise.

---
