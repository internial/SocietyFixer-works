 SocietyFixer - Developer Documentation


1. Features
-----------
SocietyFixer is a platform designed to lower the barrier to entry for political candidates by providing a free, policy-focused space to connect with voters.

- Public Campaign Directory: A searchable and filterable homepage displaying all campaigns.
- User Authentication: Secure user registration, login, and session management.
- Campaign CRUD Operations: Authenticated users can create, read, update, and delete their own campaign pages.
- Rich Text Policy Editor: A Quill.js-based editor for candidates to format their proposed policies with headings, lists, and links.
- Secure File Uploads: Candidates can upload a portrait image and a PDF resume, which are stored securely in Supabase Storage.
- AI-Powered Content Moderation: User-submitted text (e.g., candidate name, policies) is analyzed by the Google Gemini API to prevent harmful content.
- Responsive & Accessible Design: The UI is built with Bootstrap to be fully responsive and includes ARIA attributes for accessibility.
- Dynamic SEO: Page titles and meta descriptions are updated dynamically using React Router for better search engine visibility.
- Form Persistence: In-progress campaign forms are automatically saved to the browser's localStorage to prevent data loss on accidental closure.
- Optimized Image Delivery: Supabase's image transformation API is used to serve resized, optimized images for better performance.


2. System Architecture
----------------------
The application follows a modern Jamstack architecture, separating the frontend from the backend services.

- Frontend: A Single-Page Application (SPA) built with React and TypeScript. It is responsible for all UI rendering and client-side logic. It interacts directly with the backend services via their APIs.
- Backend-as-a-Service (BaaS): The entire backend is powered by Supabase.
  - Database: Supabase Postgres is the single source of truth for all user and campaign data.
  - Authentication: Supabase Auth handles all user identity management, including sign-ups, logins, and JWT-based session management.
  - Storage: Supabase Storage is used for storing user-uploaded files like portraits and resumes.
- AI Services: The Google Gemini API is used as a serverless function for content moderation.


3. Folder and File Structure
----------------------------

  Root Files
  ----------
  - index.html: The main HTML file that serves as the entry point for the web app, loading all necessary scripts and styles.
  - index.tsx: The primary TypeScript file that boots up the React application and renders it into the `index.html` file.
  - App.tsx: The root React component that organizes the application's overall layout, routing, and global context providers.
  - style.css: The central stylesheet that defines the application's custom visual appearance, including the dark theme and component styles.
  - types.ts: A centralized file that defines all shared TypeScript types and interfaces used throughout the project.
  - metadata.json: A configuration file that specifies the app's name, description, and any required device permissions.

  Folders
  -------
  - components/: Contains all the reusable React components, such as buttons, forms, and cards, that build the user interface.
  - hooks/: Holds custom React hooks that encapsulate and share stateful logic across different components.
  - lib/: Contains shared helper functions and singleton initializations, like the Supabase client.
  - pages/: Contains the main components for each page of the application, which are managed by the router.
  - services/: Holds modules responsible for communicating with external APIs, like the Google Gemini AI service.

  Files by Folder
  ---------------
    components/
    -----------
    - Alert.tsx: A reusable component for displaying dismissible alert messages to the user.
    - AuthProvider.tsx: A context provider that manages and shares user authentication state across the entire app.
    - CampaignCard.tsx: A card component that shows a brief summary of a political campaign.
    - CampaignForm.tsx: A comprehensive form for users to create or edit their campaign details.
    - ConfirmModal.tsx: A modal dialog that prompts the user to confirm a critical action, like deleting a campaign.
    - FileUpload.tsx: A component that handles file uploads with drag-and-drop support to Supabase storage.
    - Footer.tsx: The application's footer, containing copyright information and links to legal pages.
    - FormField.tsx: A reusable input field component that includes a label and error message handling to simplify form creation.
    - Logo.tsx: Renders the application's SVG logo.
    - Navbar.tsx: The main navigation bar at the top of the page, including links, a search bar, and user account controls.
    - QuillEditor.tsx: A wrapper for the Quill.js rich text editor, used for formatting policy proposals.
    - Spinner.tsx: A simple, centered spinner component to indicate loading states.
    - Toast.tsx: Represents a single pop-up notification message.
    - ToastContainer.tsx: A container that manages the positioning and display of all active toast notifications.
    - ToastProvider.tsx: A context provider that allows any component to trigger toast notifications.
    - Tooltip.tsx: A wrapper component that adds an informational tooltip to its child element on hover.

    hooks/
    ------
    - useAuth.ts: A custom hook for easily accessing the current user and session information.
    - usePageMetadata.ts: A hook to dynamically update the page's title and meta description for better SEO.
    - usePaginatedCampaigns.ts: A hook that manages the logic for fetching and paginating campaign data from the database.
    - useToast.ts: A convenient hook for showing toast notifications from any component.

    lib/
    ----
    - imageHelper.ts: A utility module for transforming Supabase image URLs to request optimized, resized versions.
    - storageHelper.ts: Contains helper functions for parsing storage URLs and creating text snippets from HTML content.
    - supabase.ts: Initializes and exports the single, shared Supabase client for the entire application.

    pages/
    ------
    - AboutPage.tsx: The "About Us" page, explaining the mission and vision behind SocietyFixer.
    - AuthPage.tsx: The page that handles user login and registration.
    - CampaignDetailPage.tsx: Displays the full, detailed information for a single political campaign.
    - CofounderPage.tsx: The page containing information about the search for technical cofounders.
    - ContactPage.tsx: The "Contact Us" page, providing an email address for user inquiries.
    - CreateCampaignPage.tsx: The page where authenticated users can create a new campaign.
    - DashboardPage.tsx: The user's personal dashboard to view and manage all the campaigns they have created.
    - EditCampaignPage.tsx: The page that allows a user to edit one of their existing campaigns.
    - HomePage.tsx: The main landing page that displays a searchable list of all campaigns.
    - PrivacyPolicyPage.tsx: The page displaying the site's privacy policy.
    - TermsOfServicePage.tsx: The page displaying the site's terms of service.

    services/
    ---------
    - gemini.ts: A service module that uses the Gemini API to perform content moderation on user-submitted text.


4. Data Flow
------------
  Viewing Campaigns (Read)
  ------------------------
  1. `HomePage` mounts and calls the `usePaginatedCampaigns` hook.
  2. The hook constructs a query using the Supabase client to `select` data from the `campaigns` table.
  3. The query includes pagination (`.range()`) and optional text search filters (`.or()`).
  4. Supabase returns a JSON array of campaign objects.
  5. The hook updates its state, causing `HomePage` to re-render and display the campaigns using `CampaignCard` components.

  Creating a Campaign (Create)
  ----------------------------
  1. A logged-in user navigates to `/create-campaign` and fills out the `CampaignForm`.
  2. On submit, the `handleSubmit` function in `CreateCampaignPage` is triggered.
  3. Key text fields are sent to the `moderateContent` function in `services/gemini.ts`.
  4. The `moderateContent` function makes a `generateContent` API call to the Google Gemini API.
  5. If the content is deemed safe, the `handleSubmit` function proceeds.
  6. The Supabase client is used to `insert` a new row into the `campaigns` table, including the `user_id` from the current session.
  7. Upon successful insertion, the user is redirected to the homepage with a success toast.


5. User Usage Steps
-------------------
  Voter Journey
  -------------
  1. Discover: Lands on the `HomePage` to browse all campaigns.
  2. Search: Uses the search bar in the `Navbar` to find candidates by name, position, or region.
  3. Investigate: Clicks a `CampaignCard` to navigate to the `CampaignDetailPage`.
  4. Learn: Reads the candidate's detailed policy proposals and other information.

  Candidate Journey
  -----------------
  1. Register: Creates an account on the `AuthPage`.
  2. Login: Logs into their account.
  3. Create: Navigates to `/create-campaign` and fills out the form, uploading their portrait and resume.
  4. Manage: Finds their campaigns by using the search function on the homepage.
  5. Edit/Delete: Clicks on a campaign to view it, then uses the "Edit" or "Delete" buttons on the `CampaignDetailPage` to manage it.


6. Security
-----------
- Authentication: Handled by Supabase Auth, which provides secure password hashing and JWT session management.
- Authorization (RLS): Supabase's Row-Level Security (RLS) is used to enforce data access rules. Policies are configured in the Supabase dashboard to ensure users can only update or delete campaigns where the `user_id` column matches their own `auth.uid()`.
- Content Moderation: User-generated content is checked against Google's safety policies via the Gemini API to prevent hate speech, harassment, etc.
- Brute-Force Protection: The `AuthPage` implements client-side rate limiting to slow down repeated, failed login or password reset attempts.
- Spam Prevention: Public-facing email addresses are constructed using client-side JavaScript to deter simple web scrapers.


7. Tech Stack & Tools
---------------------
- Frontend Framework: React `^19.1.1`
- Language: TypeScript
- Routing: React Router DOM `^7.8.2`
- UI/Styling: Bootstrap `5.3.3`, Custom CSS
- Text Editor: Quill.js `2.0.2`
- Backend Service: Supabase JS Client `^2.56.0`
- AI Service: Google Gemini JS SDK `^1.15.0`


8. Vital Information for Developers
-----------------------------------
  Environment Variables
  ---------------------
  The application requires one environment variable to function correctly:
  - API_KEY: Your API key for the Google Gemini API. This must be configured in your deployment environment.

  Supabase Project Setup
  ----------------------
  1. Project Creation: Create a new project on [supabase.com](https://supabase.com).
  2. Credentials: Copy the Project URL and `anon` public key into `lib/supabase.ts`.
  3. Database Table: Create a table named `campaigns` with columns that match the `Campaign` interface in `types.ts`.
  4. RLS Policies: Enable Row-Level Security on the `campaigns` table. Create policies that allow public `SELECT` access but restrict `INSERT`, `UPDATE`, and `DELETE` operations to the record owner (e.g., `auth.uid() = user_id`).
  5. Storage Buckets: Create two storage buckets: `portraits` and `resumes`. Configure them for public read access.




## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
