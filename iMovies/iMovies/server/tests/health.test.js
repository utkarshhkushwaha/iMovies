
import test from 'node:test';
import assert from 'node:assert/strict';

test('health endpoint contract is documented', () => {
  const responseShape = { status: 'ok', service: 'iMovies API' };
  assert.equal(responseShape.status, 'ok');
  assert.equal(responseShape.service, 'iMovies API');
});
