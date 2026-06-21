-- Story 3-1: 6-Room Apartment Layout, Room Data Model & Environment Assets
-- Bảng per-user room unlock state. Static metadata (label/color/trigger) sống trong code (ROOM_DEFINITIONS).

CREATE TYPE room_type AS ENUM (
  'WORK_ROOM',
  'KITCHEN',
  'BEDROOM',
  'LIVING_ROOM',
  'BATHROOM',
  'GARDEN'
);

CREATE TABLE rooms (
  id                  UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  room_type           room_type   NOT NULL,
  is_unlocked         BOOLEAN     NOT NULL DEFAULT false,
  unlock_trigger_met  BOOLEAN     NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT rooms_user_room_unique UNIQUE (user_id, room_type)
);

CREATE INDEX idx_rooms_user_id ON rooms (user_id);

-- RLS: user chỉ đọc/ghi row của mình
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY rooms_user_policy ON rooms
  USING (auth.uid() = user_id);

-- updated_at trigger (dùng lại function từ migration 20260614195017)
CREATE TRIGGER rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
