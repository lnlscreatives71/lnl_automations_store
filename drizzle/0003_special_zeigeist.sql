-- Add category field with default value first
ALTER TABLE `products` ADD `category` enum('agent_workflows','automated_workflows','voice_chat_bots','websites','personal_assistant_agents','social_media_post_packs','social_media_content_topics','talking_avatars','branded_assets') DEFAULT 'automated_workflows';

-- Update any existing products to have a default category
UPDATE `products` SET `category` = 'automated_workflows' WHERE `category` IS NULL;

-- Now make it NOT NULL
ALTER TABLE `products` MODIFY `category` enum('agent_workflows','automated_workflows','voice_chat_bots','websites','personal_assistant_agents','social_media_post_packs','social_media_content_topics','talking_avatars','branded_assets') NOT NULL;