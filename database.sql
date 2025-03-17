create table public.usuarios (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  nome text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Habilitar RLS (Row Level Security)
alter table public.usuarios enable row level security;

-- Criar política de acesso
create policy "Usuários podem ver seus próprios dados"
  on public.usuarios for all
  using (auth.uid() = id);

-- Criar função para inserir usuário automaticamente após signup
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.usuarios (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Criar trigger para inserir usuário após signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Tabela de códigos de convite
create table public.convites (
  id uuid primary key default uuid_generate_v4(),
  codigo text not null unique,
  utilizado boolean default false,
  utilizado_por uuid references auth.users(id),
  data_criacao timestamp with time zone default now() not null,
  data_utilizacao timestamp with time zone
);

-- Habilitar RLS (Row Level Security)
alter table public.convites enable row level security;

-- Criar política de acesso para convites
create policy "Apenas administradores podem gerenciar convites"
  on public.convites for all
  using (auth.role() = 'authenticated');

-- Inserindo códigos de convite na tabela convites
INSERT INTO public.convites (codigo) VALUES
('CONVITE123'),
('CONVITE456'),
('CONVITE789'),
('CONVITE101'),
('CONVITE202');

-- Função para gerar códigos de convite aleatórios
CREATE OR REPLACE FUNCTION gerar_codigo_convite()
RETURNS text AS $$
DECLARE
    codigo text;
BEGIN
    codigo := LPAD((FLOOR(RANDOM() * 10000))::text, 4, '0');
    RETURN codigo;
END;
$$ LANGUAGE plpgsql;

-- Inserindo 10 códigos de convite aleatórios na tabela convites
DO $$
BEGIN
    FOR i IN 1..10 LOOP
        INSERT INTO public.convites (codigo) VALUES (gerar_codigo_convite());
    END LOOP;
END $$; 