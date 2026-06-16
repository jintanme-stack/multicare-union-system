-- Drop existing policy
DROP POLICY IF EXISTS "Allow write to public global lists" ON public.mcs_store;

-- Re-create policy including 'mcsa_blog_posts' in the list of allowed keys
CREATE POLICY "Allow write to public global lists" ON public.mcs_store
FOR ALL USING (
  key IN (
    'mcsa_pending', 'mcsa_union_members', 'mcsa_inquiries', 'mcsa_lib_items',
    'mcsa_announcements', 'mcsa_activity_photos', 'mcsa_escort_forms',
    'mcsa_confinement_contracts', 'mcsa_elderly_contracts', 'mcsa_footer_info',
    'mcsa_calendar_appointments', 'mcsa_blog_posts'
  )
) WITH CHECK (
  key IN (
    'mcsa_pending', 'mcsa_union_members', 'mcsa_inquiries', 'mcsa_lib_items',
    'mcsa_announcements', 'mcsa_activity_photos', 'mcsa_escort_forms',
    'mcsa_confinement_contracts', 'mcsa_elderly_contracts', 'mcsa_footer_info',
    'mcsa_calendar_appointments', 'mcsa_blog_posts'
  )
);
