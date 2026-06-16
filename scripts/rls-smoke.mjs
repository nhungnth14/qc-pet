// RLS + patch smoke test (Story 0-2 + code review patches) — chạy với local Supabase up.
// Bao phủ: P5 trigger auto-provision public.users · P4 bc_balance ở pets · RLS cross-user
// · WITH CHECK chặn insert hộ · P1 client KHÔNG DELETE được · P2 role anon (no JWT) bị chặn.
// Env override được: SUPABASE_URL / SUPABASE_ANON_KEY (mặc định local 127.0.0.1:54321).
const BASE = process.env.SUPABASE_URL ?? 'http://127.0.0.1:54321';
const APIKEY = process.env.SUPABASE_ANON_KEY ?? 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';
const h = (tok) => ({
  apikey: APIKEY,
  authorization: `Bearer ${tok ?? APIKEY}`,
  'content-type': 'application/json',
});

async function signupAnon(label) {
  const r = await fetch(`${BASE}/auth/v1/signup`, {
    method: 'POST',
    headers: { apikey: APIKEY, 'content-type': 'application/json' },
    body: JSON.stringify({}),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error(`${label} signup failed: ${JSON.stringify(j)}`);
  console.log(`  ${label}: uid=${j.user.id} is_anonymous=${j.user.is_anonymous}`);
  return { token: j.access_token, uid: j.user.id };
}

async function rest(method, path, tok, body) {
  const r = await fetch(`${BASE}/rest/v1/${path}`, {
    method,
    headers: { ...h(tok), prefer: 'return=representation' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  return { status: r.status, data };
}

let pass = 0, fail = 0;
const check = (name, cond, extra = '') => {
  console.log(`  ${cond ? '✅ PASS' : '❌ FAIL'}  ${name}${extra ? ' — ' + extra : ''}`);
  cond ? pass++ : fail++;
};

console.log('1) Tạo 2 user ẩn danh (trigger P5 sẽ tự tạo public.users)');
const A = await signupAnon('A');
const B = await signupAnon('B');

console.log('2) P5: public.users tự tạo cho A (KHÔNG insert tay)');
const aUsers = await rest('GET', 'users?select=id', A.token);
const aHasUser = Array.isArray(aUsers.data) && aUsers.data.length === 1 && aUsers.data[0].id === A.uid;
check('A có sẵn users row (trigger auto-provision)', aHasUser,
  `thấy ${Array.isArray(aUsers.data) ? aUsers.data.length : '?'} row`);

console.log('3) A tạo pets (P4: bc_balance ở pets) + game_state của mình');
const pa = await rest('POST', 'pets', A.token, { user_id: A.uid, name: 'Bugsy', bc_balance: 7, qp_total: 0 });
check('A insert pets(self) có bc_balance', pa.status === 201, `status=${pa.status}`);
const ga = await rest('POST', 'game_state', A.token, { user_id: A.uid });
check('A insert game_state(self)', ga.status === 201, `status=${ga.status}`);

console.log('4) RLS cross-user: B KHÔNG đọc được pets của A');
const bRead = await rest('GET', 'pets?select=*', B.token);
const bSeesA = Array.isArray(bRead.data) && bRead.data.some((r) => r.user_id === A.uid);
check('B không đọc được pets của A', !bSeesA,
  `B thấy ${Array.isArray(bRead.data) ? bRead.data.length : '?'} row`);

console.log('5) A đọc pets của mình → đúng 1 row, bc_balance=7');
const aRead = await rest('GET', 'pets?select=*', A.token);
const aOk = Array.isArray(aRead.data) && aRead.data.length === 1
  && aRead.data[0].user_id === A.uid && aRead.data[0].bc_balance === 7;
check('A đọc pets của mình (bc_balance=7)', aOk,
  `A thấy ${Array.isArray(aRead.data) ? aRead.data.length : '?'} row`);

console.log('6) WITH CHECK: B insert pets HỘ A → bị chặn');
const bForA = await rest('POST', 'pets', B.token, { user_id: A.uid, name: 'Hack', bc_balance: 99 });
check('B KHÔNG insert được pets cho A', bForA.status >= 400, `status=${bForA.status}`);

console.log('7) P1: A KHÔNG DELETE được users của mình (chặn cascade xoá data)');
const aDel = await rest('DELETE', `users?id=eq.${A.uid}`, A.token);
check('A bị chặn DELETE users', aDel.status >= 400, `status=${aDel.status}`);

console.log('8) P2: role anon (chỉ apikey, KHÔNG user JWT) bị chặn insert');
const anonIns = await rest('POST', 'pets', null, { user_id: A.uid, name: 'AnonHack' });
check('anon KHÔNG insert được pets', anonIns.status >= 400, `status=${anonIns.status}`);

console.log(`\nKẾT QUẢ: ${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
