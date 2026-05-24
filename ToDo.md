# Contact Manager Project Completion Checklist

## 1. Stabilize the backend API
- [x] Add a backend `.env` with `PORT`, `CONNECTION_STRING`, and `ACCESS_TOKEN_SECRET`, and document the required values.
- [x] Verify MongoDB connection and confirm the server starts cleanly with proper error messages when env values are missing.
- [x] Fix `validateTokenHandler.js` so unauthorized requests always return a response when the token is missing, malformed, or invalid.
- [x] Update `currentUser` in `userController.js` to return the authenticated user's real details instead of the placeholder message.
- [x] Fix response handling in auth controllers so the code does not both send JSON and then throw errors in the same path.
- [x] Standardize status codes across contact controllers (`GET`/`PUT` should not return `201`).
- [x] Secure `getContact` so a user cannot fetch another user's contact by ID.
- [x] Remove debug `console.log` calls that should not stay in production code.

## 2. Finish the auth flow on the frontend
- [ ] Decide the expected auth UX after registration: either log the user in immediately or keep registration and login as separate steps.
- [ ] Fix the Redux user state shape so registration, login, cookie restore, and logout all use the same fields consistently.
- [ ] Redirect users after successful login/logout instead of leaving them on the same screen.
- [ ] Prevent unauthenticated users from accessing the contacts page directly.
- [ ] Replace `alert()`-based auth messaging with inline UI feedback or a reusable notification component.
- [ ] Add loading and error states for login and registration requests.

## 3. Complete the contact management flow
- [ ] Finish the missing Redux reducers in `contactSlice.js` (`setContact`, `updateContact`) or remove them if they are not needed.
- [ ] Update `AddContact` to use the API response object instead of pushing raw form data into Redux.
- [ ] Add contact editing support in the UI and connect it to the backend `PUT /api/contacts/:id` route.
- [ ] Add contact details viewing or selection behavior if single-contact state is meant to be supported.
- [ ] Add empty-state UI for when a user has no saved contacts yet.
- [ ] Add loading, success, and error states for fetch, create, update, and delete contact actions.
- [ ] Confirm the contacts list refreshes correctly after every CRUD action without relying on stale local state.

## 4. Fix routing and navigation
- [ ] Add a real landing page for `/` or redirect `/` to a meaningful route.
- [ ] Remove or implement the `/about` route because the navigation links to a page that does not exist.
- [ ] Highlight the correct active nav links and ensure navigation reflects the logged-in state reliably after page refresh.

## 5. Clean up frontend architecture
- [ ] Move API base URLs out of hardcoded `http://localhost:5001` strings and use env config or the existing proxy consistently.
- [ ] Create a small API helper/service layer so auth and contact requests are not scattered across components.
- [ ] Revisit cookie handling and decide whether to keep cookies or move token persistence to a safer/cleaner approach.
- [ ] Avoid fetching avatars directly from the UI without fallback handling; add a default avatar or graceful error state.
- [ ] Fix date display formatting in contact cards (`getMonth()` is zero-based).

## 6. Improve validation and UX polish
- [ ] Add client-side validation for email format, password rules, and phone number format.
- [ ] Add duplicate contact prevention rules if the same user should not store the same contact twice.
- [ ] Improve forms with disabled submit states during requests.
- [ ] Review the layout and styling for mobile responsiveness and smaller screens.
- [ ] Add confirmation UX before deleting a contact.

## 7. Add testing
- [ ] Add backend tests for auth routes, token validation, and contact CRUD permissions.
- [ ] Add frontend tests for login, registration, protected navigation, and contact CRUD flows.
- [ ] Add at least one integration test covering login plus contact creation and retrieval.

## 8. Prepare for delivery
- [ ] Write setup instructions in a root `README.md` covering install, env setup, how to run frontend/backend, and available scripts.
- [ ] Rename unclear scripts like `chalao` to something more standard such as `dev`.
- [ ] Add basic seed/demo instructions or sample test accounts for easier review.
- [ ] Do a final pass on naming, code formatting, and dead code cleanup.
