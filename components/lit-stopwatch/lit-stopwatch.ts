import { LitElement, html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import styles from './lit-stopwatch.css' with { type: 'css' };
import '../lit-lap-list/lit-lap-list.js';

/**
 * 스톱워치 기능을 제공하는 커스텀 엘리먼트입니다.
 * 
 * @element lit-stopwatch
 * @fires stopwatch-start - 스톱워치가 시작될 때 발생합니다.
 * @fires stopwatch-stop - 스톱워치가 정지될 때 발생하며, detail에 elapsedTime을 포함합니다.
 * @fires stopwatch-reset - 스톱워치가 초기화될 때 발생합니다.
 * @fires stopwatch-lap - 랩 타임이 기록될 때 발생하며, detail에 lapTime을 포함합니다.
 * 
 * @example
 * ```html
 * <lit-stopwatch></lit-stopwatch>
 * <script>
 *   const stopwatch = document.querySelector('lit-stopwatch');
 *   stopwatch.addEventListener('stopwatch-stop', (e) => {
 *     console.log('경과 시간:', e.detail.elapsedTime);
 *   });
 * </script>
 * ```
 */
@customElement('lit-stopwatch')
export class LitStopwatch extends LitElement {
  // 브라우저 표준 Constructable Stylesheets 기법을 이용한 외부 CSS 적용
  static styles = [styles];

  /** 스톱워치의 동작 여부 상태 */
  @state() isRunning = false;
  /** 누적된 경과 시간 (단위: 밀리초) */
  @state() elapsedTime = 0;
  /** 기록된 랩 타임 배열 (단위: 밀리초) */
  @state() laps: number[] = [];

  /** 내부적으로 사용되는 타이머 시작 시간 측정 기준값 */
  private startTime = 0;
  /** requestAnimationFrame이 아닌 setInterval을 사용하는 타이머 ID */
  private animationFrameId: number | null = null;

  /**
   * 스톱워치를 시작합니다.
   * 이미 실행 중인 경우 무시됩니다.
   * @returns {void}
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startTime = Date.now() - this.elapsedTime;
    
    const tick = () => {
      this.elapsedTime = Date.now() - this.startTime;
    };
    this.animationFrameId = window.setInterval(tick, 10);
    
    this.dispatchEvent(new CustomEvent('stopwatch-start', { bubbles: true, composed: true }));
  }

  /**
   * 스톱워치를 정지합니다.
   * 정지 시 `stopwatch-stop` 이벤트가 발생합니다.
   * @returns {void}
   */
  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      clearInterval(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    this.dispatchEvent(new CustomEvent('stopwatch-stop', { 
      detail: { elapsedTime: this.elapsedTime },
      bubbles: true, 
      composed: true 
    }));
  }

  /**
   * 스톱워치의 경과 시간 및 랩 타임을 초기화합니다.
   * 초기화 시 `stopwatch-reset` 이벤트가 발생합니다.
   * @returns {void}
   */
  reset(): void {
    this.stop();
    this.elapsedTime = 0;
    this.laps = [];
    this.dispatchEvent(new CustomEvent('stopwatch-reset', { bubbles: true, composed: true }));
  }

  /**
   * 현재 경과 시간을 랩 타임으로 기록합니다.
   * 실행 중일 때만 동작하며 `stopwatch-lap` 이벤트가 발생합니다.
   * @returns {void}
   */
  lap(): void {
    if (!this.isRunning) return;
    this.laps = [...this.laps, this.elapsedTime];
    this.dispatchEvent(new CustomEvent('stopwatch-lap', { 
      detail: { lapTime: this.elapsedTime },
      bubbles: true, 
      composed: true 
    }));
  }

  /**
   * 랩 버튼 및 리셋 버튼 클릭을 처리하는 핸들러입니다.
   * 스톱워치가 실행 중일 때는 랩을 기록하고, 정지 중일 때는 스톱워치를 초기화합니다.
   * @returns {void}
   */
  private _handleLapReset(): void {
    if (this.isRunning) {
      this.lap();
    } else {
      this.reset();
    }
  }

  /**
   * 스톱워치의 시작/정지 상태를 토글하는 핸들러입니다.
   * @returns {void}
   */
  private _toggleStartStop(): void {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  }

  /**
   * 밀리초 단위의 시간을 'MM:SS.ms' 형식의 문자열로 변환합니다.
   * @param ms - 변환할 밀리초(millisecond) 시간
   * @returns {string} 포맷팅된 시간 문자열
   */
  private formatTime(ms: number): string {
    const date = new Date(ms);
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const centiseconds = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');
    return `${minutes}:${seconds}.${centiseconds}`;
  }

  /**
   * LitElement의 렌더링 메서드입니다. 스톱워치 템플릿을 생성합니다.
   * @returns {TemplateResult} 렌더링할 HTML 템플릿 결과
   */
  render(): TemplateResult {
    return html`
      <div>
        <div class="time-display" role="timer" aria-live="polite" aria-atomic="true">${this.formatTime(this.elapsedTime)}</div>
        <button class="lap-reset-btn" @click="${this._handleLapReset}">
          ${this.isRunning ? 'Lap' : 'Reset'}
        </button>
        <button class="toggle-btn" @click="${this._toggleStartStop}">
          ${this.isRunning ? 'Stop' : 'Start'}
        </button>
        <lit-lap-list .laps="${this.laps}"></lit-lap-list>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-stopwatch': LitStopwatch;
  }
}
