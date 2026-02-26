-- Check public schema tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Check app_state schema tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'app_state' ORDER BY table_name;

-- Check UserBotAccess records
SELECT COUNT(*) as total_access_records FROM app_state."UserBotAccess";

-- Check User records
SELECT COUNT(*) as total_users FROM app_state."User";
