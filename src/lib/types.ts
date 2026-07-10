export interface JobPosting {
  id: string;
  user_id: string;
  source_url: string;
  platform: string;
  parsing_status: "success" | "partial" | "fail";
  parse_failure_reason: string | null;
  purpose_tag: string | null;
  company_name: string;
  job_title: string;
  recruitment_field: string;
  job_description: string;
  qualifications: string;
  preferences: string;
  industry: string;
  deadline_raw: string;
  deadline_date: string | null;
  required_documents: string;
  application_method: string;
  raw_text: string;
  memo: string;
  competency_keywords: string[];
  saved_at: string;
  updated_at: string;
  job_posting_images?: JobImage[];
}

export interface JobImage {
  id: string;
  storage_path: string;
  sort_order: number;
}

export interface Profile {
  id: string;
  email: string;
  nickname: string;
  avatar_url: string | null;
  created_at: string;
}
