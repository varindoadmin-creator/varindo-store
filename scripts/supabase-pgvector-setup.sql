-- Run this once in the Supabase SQL editor (Project → SQL Editor → New query).
-- Sets up storage for Lamitak product image embeddings used by Surface Match.

create extension if not exists vector;

create table if not exists product_embeddings (
  product_code text primary key,
  embedding vector(1024) not null,
  updated_at timestamptz not null default now()
);

create index if not exists product_embeddings_embedding_idx
  on product_embeddings
  using hnsw (embedding vector_cosine_ops);

-- Nearest-neighbor lookup, called from the app via
-- POST {SUPABASE_URL}/rest/v1/rpc/match_products
create or replace function match_products(
  query_embedding vector(1024),
  match_count int default 6
)
returns table (
  product_code text,
  similarity float
)
language sql stable
as $$
  select product_code, 1 - (embedding <=> query_embedding) as similarity
  from product_embeddings
  order by embedding <=> query_embedding
  limit match_count;
$$;
