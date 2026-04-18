CREATE TABLE IF NOT EXISTS public.resume_data (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  extracted_skills text[],
  domain text,
  has_projects boolean,
  has_experience boolean,
  keywords text[],
  resume_text text,
  created_at timestamp with time zone DEFAULT now()
);
