-- Check if users have identities
SELECT
  u.email,
  u.id as user_id,
  u.email_confirmed_at,
  i.id as identity_id,
  i.provider
FROM auth.users u
LEFT JOIN auth.identities i ON u.id = i.user_id
WHERE u.email IN (
  'lorenzo.d.chambers@gmail.com',
  'lorenzo@lorenzodc.com',
  'lorenzo@theglobalenterprise.org'
)
ORDER BY u.email;
