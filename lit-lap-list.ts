import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * 랩 타임 목록을 렌더링하는 커스텀 엘리먼트입니다.
 * 
 * @element lit-lap-list
 * 
 * @example
 * ```html
 * <lit-lap-list .laps="${[1000, 2500, 4200]}"></lit-lap-list>
 * ```
 */
@customElement('lit-lap-list')
export class LitLapList extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-top: 1rem;
      font-family: monospace;
    }
    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }
    .lap-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem;
      border-bottom: 1px solid #eee;
    }
    :focus-visible {
      outline: 2px solid #005fcc;
      outline-offset: 2px;
    }
  `;

  /**
   * 기록된 랩 타임 배열 (단위: 밀리초)
   */
  @property({ type: Array }) laps: number[] = [];

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
   * LitElement의 렌더링 메서드입니다. 랩 타임 목록 템플릿을 생성합니다.
   * @returns {TemplateResult} 렌더링할 HTML 템플릿 결과
   */
  render(): TemplateResult {
    return html`
      <ul>
        ${this.laps.map((lap, index) => html`
          <li class="lap-item">
            <span>Lap ${index + 1}</span>
            <span>${this.formatTime(lap)}</span>
          </li>
        `)}
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-lap-list': LitLapList;
  }
}
