# Repeatable Task Workflows

This document captures step-by-step workflows for common, repetitive tasks in Trellone. Follow these checklists to implement features consistently and safely.

## Add a new RTK Query endpoint

Last performed: 2025-09-21

Files to modify:

- [`src/lib/redux/helpers.ts`](src/lib/redux/helpers.ts)
- API slice file under [`src/queries`](src/queries)
- Optionally update tags or usage in feature components under [`src/pages`](src/pages) or [`src/components`](src/components)

Steps:

1. Open the appropriate API slice in [`src/queries`](src/queries) or create a new one if the domain is new.
2. Ensure the API slice uses axiosBaseQuery from [`src/lib/redux/helpers.ts`](src/lib/redux/helpers.ts) and defines reducerPath and tagTypes.
3. Add the endpoint via build.query or build.mutation with proper generics for Response and Body types.
4. Set providesTags for queries and invalidatesTags for mutations; include LIST and item tags where applicable.
5. Implement onQueryStarted for side-effects such as toasts, cache updates, or slice updates if required.
6. Export the generated hook (e.g., useGetItemsQuery, useAddItemMutation).
7. Find usages and integrate the hook into components/pages; wire loading, error, and data states.
8. Manually test: success, error, and edge-cases; verify tags invalidate as expected.

Important considerations:

- Follow existing tag naming patterns for the domain to keep cache coherent.
- Keep Response and Body types sourced from Zod schema-derived types where available.
- Ensure errors are surfaced via consistent toast patterns and type guards.

## Add a new Redux slice

Last performed: 2025-09-21

Files to modify:

- [`src/store/slices`](src/store/slices)
- [`src/store/root.reducer.ts`](src/store/root.reducer.ts)

Steps:

1. Create a new file in [`src/store/slices`](src/store/slices) with kebab-case name and .slice.ts suffix.
2. Define the SliceState interface, initialState, and createSlice with clear, descriptive reducers.
3. Export actions via destructuring and default export the reducer.
4. Register the reducer in [`src/store/root.reducer.ts`](src/store/root.reducer.ts) and ensure proper typing.
5. If the slice holds non-serializable values, confirm serializableCheck is disabled in store config.
6. Use typed hooks from [`src/lib/redux/hooks.ts`](src/lib/redux/hooks.ts) in components to interact with the slice.

Important considerations:

- Use clear action names: setX, updateX, clearX.
- Keep state minimal and derived where possible; prefer RTK Query cache over duplicating server state.

## Add a new feature page and route

Last performed: 2025-09-21

Files to modify:

- [`src/constants/path.ts`](src/constants/path.ts)
- Route composition inside [`src/App.tsx`](src/App.tsx)
- New page under [`src/pages`](src/pages) (feature-first folder)

Steps:

1. Add a route constant to [`src/constants/path.ts`](src/constants/path.ts).
2. Create the page component under [`src/pages`](src/pages) following feature-first structure.
3. Lazy-load the page in [`src/App.tsx`](src/App.tsx) with React.lazy and add a route entry inside Suspense with a proper guard (ProtectedRoute, RejectedRoute, VerifiedRoute) as appropriate.
4. Verify navigation points (NavBar, links, redirects) reference the new route.
5. Manually test navigation, guards, and SEO if applicable.

Important considerations:

- Use Suspense with a standardized loading spinner.
- Apply the correct guard to protect or reject access based on auth/verification.

## Add a form using React Hook Form + Zod

Last performed: 2025-09-21

Files to modify:

- Zod schema in [`src/schemas`](src/schemas)
- Page or component under [`src/pages`](src/pages) or [`src/components`](src/components)
- Optional: API integration in [`src/queries`](src/queries)

Steps:

1. Define or update Zod schema under [`src/schemas`](src/schemas) and export the inferred TypeScript type.
2. Initialize useForm with zodResolver and defaultValues in your component.
3. Wire inputs using custom TextFieldInput or Controller for complex MUI inputs; use FieldErrorAlert for validation display.
4. Implement submit handler via handleSubmit, call the appropriate RTK Query mutation hook, and handle `.then()` or `.unwrap()` responses.
5. Map server-side 422 validation errors using isUnprocessableEntityError and setError.
6. Provide interceptor-loading class on submit buttons and proper disabled states.

Important considerations:

- Keep form state minimal; rely on schema-derived types and defaults.
- Place error displays immediately after inputs for consistent UX.

## Add a Socket.IO room or event flow

Last performed: 2025-09-21

Files to modify:

- Socket factory at [`src/lib/socket.ts`](src/lib/socket.ts)
- Feature listener/emitters within pages/components under [`src/pages`](src/pages) or [`src/components`](src/components)
- Optional slice updates in [`src/store/slices`](src/store/slices)

Steps:

1. Confirm the socket is created after authentication in [`src/App.tsx`](src/App.tsx) and is accessible via app slice.
2. In the target page/component, join the relevant room on mount and leave on unmount.
3. Register event listeners; dispatch Redux actions or refetch RTK Query endpoints as needed.
4. On reconnect_attempt, ensure room rejoin logic is robust; rely on reconnection auth refresh in [`src/lib/socket.ts`](src/lib/socket.ts).
5. Emit events post-mutations to broadcast changes to other clients.

Important considerations:

- Keep listener registration cleanup solid to avoid duplicate handlers.
- Ensure event payloads are validated and do not leak sensitive data.

## Add a utility function

Last performed: 2025-09-21

Files to modify:

- Appropriate utility file in [`src/utils`](src/utils) or create a new file
- Optional usage sites in [`src/pages`](src/pages) or [`src/components`](src/components)

Steps:

1. Identify the correct utility domain file (e.g., formatters.ts, validators.ts, storage.ts); create a new specific file if needed.
2. Implement a pure, typed function with clear name and JSDoc (if complex).
3. Add unit-like usage in a small scope first; verify correctness and edge cases.
4. Replace ad-hoc logic at call sites with the new utility.

Important considerations:

- Prefer precise names and strong typing; add type guards where appropriate.
- Avoid duplicate functionality already present in utils.

## Add a custom hook

Last performed: 2025-09-21

Files to modify:

- [`src/hooks`](src/hooks)

Steps:

1. Create a new file in [`src/hooks`](src/hooks) with use- prefix and kebab-case.
2. Define interface(s) for options and return values; set sensible defaults; validate inputs early.
3. Implement logic using useEffect/useCallback/useRef as needed; ensure cleanup is robust.
4. Export via named export; import specific lodash utilities when helpful.
5. Add example usage documentation in JSDoc if the hook is non-trivial.

Important considerations:

- Keep dependencies complete in useEffect/useCallback.
- Ensure performance via memoization and passive listeners where applicable.

## Update theme tokens or component overrides

Last performed: 2025-09-21

Files to modify:

- [`src/theme.ts`](src/theme.ts)

Steps:

1. Update custom tokens or colorSchemes within the theme; observe module augmentation patterns.
2. Add or adjust component styleOverrides using sx-like objects.
3. Validate in both light and dark modes and across key breakpoints.

Important considerations:

- Maintain consistency with existing spacing, radii, and palette choices.
- Avoid introducing overrides that drift from established design language.

## Release checklist (manual)

Last performed: 2025-09-21

Checklist:

- Build locally and verify output: scripts in [`package.json`](package.json)
- Confirm env variables in [`src/constants/config.ts`](src/constants/config.ts) and deployment platform settings
- Smoke-test critical flows: auth, board view, DnD, attachments, socket reconnect
- Verify SEO and metadata on key pages using [`src/components/SEO/SEO.tsx`](src/components/SEO/SEO.tsx)
- Run lint and format: ESLint and Prettier scripts in [`package.json`](package.json)
