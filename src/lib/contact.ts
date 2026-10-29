/** Topics on the /contact form; the label is the email's subject tag. */
export const CONTACT_TOPICS = {
  question: "A question",
  bug: "Something broke",
  billing: "Billing or a refund",
  idea: "An idea",
} as const;

export type ContactTopic = keyof typeof CONTACT_TOPICS;
export const CONTACT_TOPIC_IDS = Object.keys(CONTACT_TOPICS) as [ContactTopic, ...ContactTopic[]];
