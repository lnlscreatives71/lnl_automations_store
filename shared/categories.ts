/**
 * Product categories for LNL Automations store
 * Shared between frontend and backend
 */

export const PRODUCT_CATEGORIES = {
  agent_workflows: "Agent Workflows",
  automated_workflows: "Automated Workflows",
  voice_chat_bots: "Voice & Chat Bots",
  websites: "Websites",
  personal_assistant_agents: "Personal Assistant Agents",
  social_media_post_packs: "Social Media Post Packs",
  social_media_content_topics: "Social Media Content Topics with Viral Hooks",
  talking_avatars: "Talking Avatars",
  branded_assets: "Branded Assets",
} as const;

export type ProductCategory = keyof typeof PRODUCT_CATEGORIES;

export const CATEGORY_DESCRIPTIONS = {
  agent_workflows: "Pre-built AI agent workflows for automation and productivity",
  automated_workflows: "Ready-to-use automation workflows for common business tasks",
  voice_chat_bots: "Voice-enabled and text-based chatbot solutions",
  websites: "Complete website templates and designs",
  personal_assistant_agents: "AI-powered personal assistant agents for task management",
  social_media_post_packs: "Curated social media post templates and content packs",
  social_media_content_topics: "Viral content topics with proven hooks and engagement strategies",
  talking_avatars: "Animated talking avatar solutions for video content",
  branded_assets: "Professional branded assets including logos, templates, and design elements",
} as const;

/**
 * Get display name for a category
 */
export function getCategoryDisplayName(category: ProductCategory): string {
  return PRODUCT_CATEGORIES[category];
}

/**
 * Get description for a category
 */
export function getCategoryDescription(category: ProductCategory): string {
  return CATEGORY_DESCRIPTIONS[category];
}

/**
 * Get all categories as array
 */
export function getAllCategories(): Array<{ value: ProductCategory; label: string; description: string }> {
  return Object.entries(PRODUCT_CATEGORIES).map(([value, label]) => ({
    value: value as ProductCategory,
    label,
    description: CATEGORY_DESCRIPTIONS[value as ProductCategory],
  }));
}
