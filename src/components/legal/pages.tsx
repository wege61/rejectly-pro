"use client";

import { LegalPage } from "./LegalPage";
import { TERMS, TERMS_UPDATED } from "./terms";
import { PRIVACY_SECTIONS, PRIVACY_UPDATED } from "./privacy";

/* The content is JSX, so it's imported on the client side rather than passed down as props. */
export const TermsPage = () => <LegalPage title="Terms of Service" updated={TERMS_UPDATED} sections={TERMS} />;
export const PrivacyPage = () => <LegalPage title="Privacy Policy" updated={PRIVACY_UPDATED} sections={PRIVACY_SECTIONS} />;
