import { html, fixture, expect, elementUpdated, oneEvent, aTimeout } from '@open-wc/testing';
import { LitStopwatch } from './lit-stopwatch.js';
import './lit-stopwatch.js';

describe('LitStopwatch', () => {
  it('초기 상태에서는 00:00.00을 표시하고 실행 중이 아니어야 한다', async () => {
    const el = await fixture<LitStopwatch>(html`<lit-stopwatch></lit-stopwatch>`);
    const display = el.shadowRoot!.querySelector('.time-display')!;
    expect(display.textContent).to.include('00:00.00');
    expect(el.isRunning).to.be.false;
  });

  it('Start 버튼을 누르면 시간이 증가하고 버튼 텍스트가 Stop으로 변경된다', async () => {
    const el = await fixture<LitStopwatch>(html`<lit-stopwatch></lit-stopwatch>`);
    const toggleBtn = el.shadowRoot!.querySelector('.toggle-btn') as HTMLButtonElement;
    
    expect(toggleBtn.textContent?.trim()).to.equal('Start');
    
    setTimeout(() => toggleBtn.click());
    await oneEvent(el, 'stopwatch-start');
    await elementUpdated(el);
    
    expect(el.isRunning).to.be.true;
    expect(toggleBtn.textContent?.trim()).to.equal('Stop');
    
    await aTimeout(100); // 100ms 대기
    await elementUpdated(el);
    
    const display = el.shadowRoot!.querySelector('.time-display')!;
    expect(display.textContent).to.not.include('00:00.00'); // 시간이 변했는지 확인
    expect(el.elapsedTime).to.be.greaterThan(0);
  });

  it('Stop 버튼을 누르면 시간이 멈추고 이벤트가 발생해야 한다', async () => {
    const el = await fixture<LitStopwatch>(html`<lit-stopwatch></lit-stopwatch>`);
    el.start();
    await elementUpdated(el);
    
    await aTimeout(100);
    
    const toggleBtn = el.shadowRoot!.querySelector('.toggle-btn') as HTMLButtonElement;
    setTimeout(() => toggleBtn.click());
    const { detail } = await oneEvent(el, 'stopwatch-stop');
    
    expect(el.isRunning).to.be.false;
    expect(detail.elapsedTime).to.be.greaterThan(0);
    
    const stoppedTime = el.elapsedTime;
    await aTimeout(100);
    expect(el.elapsedTime).to.equal(stoppedTime); // 더 이상 시간이 증가하지 않아야 함
  });

  it('정지 상태에서 Reset 버튼을 누르면 초기 상태로 돌아간다', async () => {
    const el = await fixture<LitStopwatch>(html`<lit-stopwatch></lit-stopwatch>`);
    el.start();
    await aTimeout(50);
    el.stop();
    await elementUpdated(el);
    
    // 강제로 laps에 데이터 넣음
    (el as any).laps = [1000];
    
    const resetBtn = el.shadowRoot!.querySelector('.lap-reset-btn') as HTMLButtonElement;
    setTimeout(() => resetBtn.click());
    await oneEvent(el, 'stopwatch-reset');
    
    await elementUpdated(el);
    const display = el.shadowRoot!.querySelector('.time-display')!;
    expect(display.textContent).to.include('00:00.00');
    expect(el.elapsedTime).to.equal(0);
    expect(el.laps.length).to.equal(0);
  });

  it('실행 중일 때 Lap 버튼을 누르면 laps 배열에 시간이 추가되고 이벤트가 발생한다', async () => {
    const el = await fixture<LitStopwatch>(html`<lit-stopwatch></lit-stopwatch>`);
    el.start();
    await elementUpdated(el);
    
    await aTimeout(50);
    
    const lapBtn = el.shadowRoot!.querySelector('.lap-reset-btn') as HTMLButtonElement;
    expect(lapBtn.textContent?.trim()).to.equal('Lap');
    
    setTimeout(() => lapBtn.click());
    const { detail } = await oneEvent(el, 'stopwatch-lap');
    
    await elementUpdated(el);
    
    expect(el.laps.length).to.equal(1);
    expect(detail.lapTime).to.equal(el.laps[0]);
    expect(el.laps[0]).to.be.greaterThan(0);
  });

  it('이미 실행 중일 때 start()를 다시 호출해도 예외가 발생하거나 상태가 꼬이지 않는다', async () => {
    const el = await fixture<LitStopwatch>(html`<lit-stopwatch></lit-stopwatch>`);
    el.start();
    await aTimeout(50);
    
    const elapsedTimeBefore = el.elapsedTime;
    el.start(); // 무시되어야 함
    
    await aTimeout(50);
    expect(el.elapsedTime).to.be.greaterThan(elapsedTimeBefore);
    expect(el.isRunning).to.be.true;
  });

  it('정지 상태에서 stop()을 호출해도 예외가 발생하지 않는다', async () => {
    const el = await fixture<LitStopwatch>(html`<lit-stopwatch></lit-stopwatch>`);
    expect(el.isRunning).to.be.false;
    expect(() => el.stop()).to.not.throw();
    expect(el.isRunning).to.be.false;
  });
});
