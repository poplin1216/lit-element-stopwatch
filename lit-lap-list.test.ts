import { html, fixture, expect } from '@open-wc/testing';
import { LitLapList } from './lit-lap-list.js';
import './lit-lap-list.js';

describe('LitLapList', () => {
  it('초기 상태에서는 랩 리스트가 비어있어야 한다', async () => {
    const el = await fixture<LitLapList>(html`<lit-lap-list></lit-lap-list>`);
    const items = el.shadowRoot!.querySelectorAll('.lap-item');
    expect(items.length).to.equal(0);
  });

  it('laps 배열을 전달하면 포맷된 시간으로 목록이 렌더링되어야 한다', async () => {
    // 1234ms = 00:01.23, 65000ms = 01:05.00
    const laps = [1234, 65000];
    const el = await fixture<LitLapList>(html`<lit-lap-list .laps=${laps}></lit-lap-list>`);
    const items = el.shadowRoot!.querySelectorAll('.lap-item');
    
    expect(items.length).to.equal(2);
    expect(items[0].textContent).to.include('Lap 1');
    expect(items[0].textContent).to.include('00:01.23');
    
    expect(items[1].textContent).to.include('Lap 2');
    expect(items[1].textContent).to.include('01:05.00');
  });
});
