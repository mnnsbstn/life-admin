-- Extend calendar provider enum for Microsoft Graph

alter type public.calendar_provider add value if not exists 'microsoft';
