
# Real-Time Government Data Integration Plan

Currently, the Indian government (Startup India, MCA, etc.) does not provide a simple, open, real-time API for third-party apps to directly stream incubator and legal data without complex registrations. However, we can achieve **real-time data fetching** by using an AI-powered search connector (like **Perplexity** or **Firecrawl**) integrated via our backend Edge Functions.

This will allow the app to scrape and summarize live data directly from government portals and trusted sources.

## What We'll Build

1. **Connector Setup**: We'll use the **Perplexity** or **Firecrawl** connector to give our app the ability to perform live web searches and scrape real-time data.
2. **Backend Edge Functions**:
   - `search-incubators`: An edge function that takes a user's city/state and industry, searches for real-time incubator details (from Startup India and local gov sites), and returns structured data.
   - `fetch-legal-compliance`: An edge function that takes a business type and state, and fetches the latest registration steps, tax laws, and compliance checklists from the Ministry of Corporate Affairs (MCA) and state portals.
3. **Frontend Integration (`Incubators.tsx` & `Legal.tsx`)**:
   - Add a dynamic search UI where users can enter their location and industry.
   - Replace the static lists with real-time loading states and dynamically populated data fetched straight from the web.

## Steps

### Step 1: Enable the Connector
We will prompt you to connect **Perplexity** (for intelligent real-time search synthesis) or **Firecrawl** (for deep web scraping). This allows the backend to access live web data.

### Step 2: Create the Edge Functions
We'll write Supabase Edge Functions (`supabase/functions/search-incubators` and `supabase/functions/fetch-legal-compliance`) that use the connected API to query for terms like *"List of active government-backed startup incubators in [State] with contact details"* and format the response into a neat JSON array for the frontend.

### Step 3: Update the Frontend Pages
- In **`src/pages/Incubators.tsx`**, we'll add a search bar and a "Find Real-Time Incubators" button. It will display a loading skeleton while fetching, and then render the live results.
- In **`src/pages/Legal.tsx`**, we'll add a "Compliance Checker" where users select their business structure and state to get a live, customized checklist of legal requirements.

## Next Action
If you approve this plan, I will start by helping you connect the **Perplexity** (or Firecrawl) connector to enable real-time web access, and then I will build the Edge Functions and update the UI!
