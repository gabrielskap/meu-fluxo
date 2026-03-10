-- Habilitar a extensão pgcrypto para gerar UUIDs se ainda não existir
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================================
-- TABELA: transactions (Transações Financeiras)
-- =========================================================================================

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('receita', 'gasto')),
    amount NUMERIC NOT NULL CHECK (amount > 0),
    date DATE NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    business TEXT NOT NULL CHECK (business IN ('salao', 'loja')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurar RLS (Row Level Security) para transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Políticas para transactions
CREATE POLICY "Usuários podem ver suas próprias transações"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias transações"
    ON public.transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias transações"
    ON public.transactions FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias transações"
    ON public.transactions FOR DELETE
    USING (auth.uid() = user_id);


-- =========================================================================================
-- TABELA: inventory (Estoque de Produtos)
-- =========================================================================================

CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity NUMERIC NOT NULL DEFAULT 0,
    price NUMERIC NOT NULL DEFAULT 0.0 CHECK (price >= 0),
    business TEXT NOT NULL CHECK (business IN ('salao', 'loja')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurar RLS (Row Level Security) para inventory
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Políticas para inventory
CREATE POLICY "Usuários podem ver seu próprio estoque"
    ON public.inventory FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seu próprio estoque"
    ON public.inventory FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio estoque"
    ON public.inventory FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seu próprio estoque"
    ON public.inventory FOR DELETE
    USING (auth.uid() = user_id);
