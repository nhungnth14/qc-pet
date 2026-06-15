// RLS smoke test (Story 0-2, Task 7.3) — chạy với local Supabase đang up.
// Tạo 2 user ẩn danh, kiểm tra: (1) user tạo được row của mình,
// (2) user KHÔNG đọc được row user khác, (3) WITH CHECK chặn insert hộ người khác.
const BASE = 'http://127.0.0.1:54321';
const APIKEY = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';
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

console.log('1) Tạo 2 user ẩn danh');
const A = await signupAnon('A');
const B = await signupAnon('B');

console.log('2) A tạo row của mình (users + game_state)');
const ua = await rest('POST', 'users', A.token, { id: A.uid });
check('A insert users(self)', ua.status === 201, `status=${ua.status}`);
const ga = await rest('POST', 'game_state', A.token, { user_id: A.uid, bc_balance: 7 });
check('A insert game_state(self)', ga.status === 201, `status=${ga.status}`);

console.log('3) B tạo row của mình');
const ub = await rest('POST', 'users', B.token, { id: B.uid });
check('B insert users(self)', ub.status === 201, `status=${ub.status}`);

console.log('4) RLS đọc cross-user: B đọc game_state → KHÔNG thấy row của A');
const bRead = await rest('GET', 'game_state?select=*', B.token);
const bSeesA = Array.isArray(bRead.data) && bRead.data.some((r) => r.user_id === A.uid);
check('B không đọc được game_state của A', !bSeesA, `B thấy ${Array.isArray(bRead.data) ? bRead.data.length : '?'} row`);

console.log('5) A đọc game_state → thấy đúng row của mình');
const aRead = await rest('GET', 'game_state?select=*', A.token);
const aSeesSelf = Array.isArray(aRead.data) && aRead.data.length === 1 && aRead.data[0].user_id === A.uid;
check('A đọc được game_state của chính mình', aSeesSelf, `A thấy ${Array.isArray(aRead.data) ? aRead.data.length : '?'} row`);

console.log('6) WITH CHECK: B insert game_state HỘ A → bị chặn');
const bForA = await rest('POST', 'game_state', B.token, { user_id: A.uid, bc_balance: 99 });
check('B KHÔNG insert được game_state cho A', bForA.status === 403 || bForA.status === 401, `status=${bForA.status}`);

console.log(`\nKẾT QUẢ: ${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
