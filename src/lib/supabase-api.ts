import { supabase } from '@/lib/supabase';

// ─── Domain types ─────────────────────────────────────────────────────────────

export type Pet = {
  id: string;
  userId: string;
  name: string;
  version: string;
  qpTotal: number;
  bcBalance: number;
};

export type NeedBars = {
  hunger: number;
  happiness: number;
  health: number;
  discipline: number;
};

export type GameState = {
  id: string;
  userId: string;
  onboardingCompleted: boolean;
  lastMissionCompletedDate: string | null;
  currentLessonIndex: number;
};

export type StandardResponse<T> = {
  data: T;
  serverTime: number;
  requestId: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ok<T>(data: T): StandardResponse<T> {
  return {
    data,
    serverTime: Date.now(),
    requestId: Math.random().toString(36).slice(2),
  };
}

type PetRow = {
  id: string;
  user_id: string;
  name: string;
  version: string;
  qp_total: number;
  bc_balance: number;
};

type NeedBarsRow = {
  hunger: number;
  happiness: number;
  health: number;
  discipline: number;
};

type GameStateRow = {
  id: string;
  user_id: string;
  onboarding_completed: boolean;
  last_mission_completed_date: string | null;
  current_lesson_index: number;
};

function mapPet(row: PetRow): Pet {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    version: row.version,
    qpTotal: row.qp_total,
    bcBalance: row.bc_balance,
  };
}

function mapNeedBars(row: NeedBarsRow): NeedBars {
  return {
    hunger: row.hunger,
    happiness: row.happiness,
    health: row.health,
    discipline: row.discipline,
  };
}

function mapGameState(row: GameStateRow): GameState {
  return {
    id: row.id,
    userId: row.user_id,
    onboardingCompleted: row.onboarding_completed,
    lastMissionCompletedDate: row.last_mission_completed_date,
    currentLessonIndex: row.current_lesson_index,
  };
}

// ─── Pet ──────────────────────────────────────────────────────────────────────

export async function getPet(userId: string): Promise<StandardResponse<Pet | null>> {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error)
    throw new Error(`getPet failed: ${error.message}`);
  return ok(data ? mapPet(data as PetRow) : null);
}

export async function createPet(userId: string, name: string): Promise<StandardResponse<Pet>> {
  const { data, error } = await supabase
    .from('pets')
    .insert({ user_id: userId, name })
    .select()
    .single();

  if (error)
    throw new Error(`createPet failed: ${error.message}`);
  return ok(mapPet(data as PetRow));
}

export async function updatePetName(petId: string, name: string): Promise<StandardResponse<Pet>> {
  const { data, error } = await supabase
    .from('pets')
    .update({ name })
    .eq('id', petId)
    .select()
    .single();

  if (error)
    throw new Error(`updatePetName failed: ${error.message}`);
  return ok(mapPet(data as PetRow));
}

export async function updatePetVersion(petId: string, version: string): Promise<StandardResponse<Pet>> {
  const { data, error } = await supabase
    .from('pets')
    .update({ version })
    .eq('id', petId)
    .select()
    .single();

  if (error)
    throw new Error(`updatePetVersion failed: ${error.message}`);
  return ok(mapPet(data as PetRow));
}

export async function addCurrency(
  petId: string,
  bcDelta: number,
  qpDelta: number,
): Promise<StandardResponse<{ bcBalance: number; qpTotal: number }>> {
  const { data: current, error: fetchError } = await supabase
    .from('pets')
    .select('bc_balance, qp_total')
    .eq('id', petId)
    .single();

  if (fetchError)
    throw new Error(`addCurrency fetch failed: ${fetchError.message}`);

  const row = current as { bc_balance: number; qp_total: number };
  const newBcBalance = row.bc_balance + bcDelta;

  if (newBcBalance < 0)
    throw new Error('Insufficient BC balance');

  const { data, error } = await supabase
    .from('pets')
    .update({ bc_balance: newBcBalance, qp_total: row.qp_total + qpDelta })
    .eq('id', petId)
    .select('bc_balance, qp_total')
    .single();

  if (error)
    throw new Error(`addCurrency update failed: ${error.message}`);

  const updated = data as { bc_balance: number; qp_total: number };
  return ok({ bcBalance: updated.bc_balance, qpTotal: updated.qp_total });
}

// ─── NeedBars ─────────────────────────────────────────────────────────────────

const DEFAULT_NEED_BARS: NeedBars = { hunger: 80, happiness: 80, health: 80, discipline: 80 };

export async function getNeedBars(userId: string): Promise<StandardResponse<NeedBars>> {
  const { data, error } = await supabase
    .from('need_bars')
    .select('hunger, happiness, health, discipline')
    .eq('user_id', userId)
    .maybeSingle();

  if (error)
    throw new Error(`getNeedBars failed: ${error.message}`);

  if (data)
    return ok(mapNeedBars(data as NeedBarsRow));

  // Shouldn't happen if signup trigger ran, but defensive fallback
  const { data: created, error: createError } = await supabase
    .from('need_bars')
    .insert({ user_id: userId, ...DEFAULT_NEED_BARS })
    .select('hunger, happiness, health, discipline')
    .single();

  if (createError)
    throw new Error(`getNeedBars create failed: ${createError.message}`);
  return ok(mapNeedBars(created as NeedBarsRow));
}

export async function updateNeedBars(
  userId: string,
  bars: Partial<NeedBars>,
): Promise<StandardResponse<NeedBars>> {
  // Upsert only the specified fields; conflict on user_id preserves unspecified columns
  const payload: Record<string, unknown> = {
    user_id: userId,
    last_synced_at: new Date().toISOString(),
  };
  if (bars.hunger !== undefined)
    payload.hunger = bars.hunger;
  if (bars.happiness !== undefined)
    payload.happiness = bars.happiness;
  if (bars.health !== undefined)
    payload.health = bars.health;
  if (bars.discipline !== undefined)
    payload.discipline = bars.discipline;

  const { data, error } = await supabase
    .from('need_bars')
    .upsert(payload, { onConflict: 'user_id' })
    .select('hunger, happiness, health, discipline')
    .single();

  if (error)
    throw new Error(`updateNeedBars failed: ${error.message}`);
  return ok(mapNeedBars(data as NeedBarsRow));
}

// ─── GameState ────────────────────────────────────────────────────────────────

export async function getGameState(userId: string): Promise<StandardResponse<GameState>> {
  const { data, error } = await supabase
    .from('game_state')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error)
    throw new Error(`getGameState failed: ${error.message}`);

  if (data)
    return ok(mapGameState(data as GameStateRow));

  const { data: created, error: createError } = await supabase
    .from('game_state')
    .insert({ user_id: userId })
    .select()
    .single();

  if (createError)
    throw new Error(`getGameState create failed: ${createError.message}`);
  return ok(mapGameState(created as GameStateRow));
}

export async function updateGameState(
  userId: string,
  updates: Partial<GameState>,
): Promise<StandardResponse<GameState>> {
  const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (updates.onboardingCompleted !== undefined)
    payload.onboarding_completed = updates.onboardingCompleted;
  if (updates.lastMissionCompletedDate !== undefined)
    payload.last_mission_completed_date = updates.lastMissionCompletedDate;
  if (updates.currentLessonIndex !== undefined)
    payload.current_lesson_index = updates.currentLessonIndex;

  const { data, error } = await supabase
    .from('game_state')
    .update(payload)
    .eq('user_id', userId)
    .select()
    .single();

  if (error)
    throw new Error(`updateGameState failed: ${error.message}`);
  return ok(mapGameState(data as GameStateRow));
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export async function completeOnboarding(
  userId: string,
  petName: string,
): Promise<StandardResponse<{ pet: Pet; gameState: GameState }>> {
  const { data: existingPet } = await supabase
    .from('pets')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  let pet: Pet;
  if (existingPet) {
    const result = await updatePetName((existingPet as { id: string }).id, petName);
    pet = result.data;
  }
  else {
    const result = await createPet(userId, petName);
    pet = result.data;
  }

  const gsResult = await updateGameState(userId, { onboardingCompleted: true });

  return ok({ pet, gameState: gsResult.data });
}
