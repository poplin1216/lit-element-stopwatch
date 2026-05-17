# Skill: Custom Element Scaffold Rule (표준 뼈대 규칙)

## Description
이 Skill은 프로젝트 내에서 새로운 Lit 기반 웹 컴포넌트(Custom Element)를 설계하고 생성할 때, 격리된 폴더 구조를 유지하고 내부 CSS 코드를 완벽히 차단하여 **외부 독립 CSS 파일**로 분리하는 일관된 스캐폴드(Scaffold) 템플릿 표준을 정의합니다.

---

## 1. Directory Structure & Isolation (폴더 구조 및 파일 격리 규칙)

새로운 커스텀 엘리먼트는 절대 루트 디렉토리나 임의의 위치에 생성하지 않으며, 소스 코드의 독립성 및 테스트 격리를 보장하기 위해 반드시 `components/` 디렉토리 하위에 컴포넌트명과 동일한 전용 격리 폴더를 생성하여 배치해야 합니다.

또한, **빌드 산출물(JS, Map, d.ts)**과 **테스트 파일(test.ts)**이 소스 코드 디렉토리와 혼재되어 지저분해지는 것을 방지하기 위해 다음과 같은 파일 격리 정책을 준수합니다.

### 📁 디렉토리 레이아웃 표준
```
project-root/
├── components/
│   └── [component-name]/
│       ├── [component-name].ts      # 컴포넌트 핵심 로직 및 마크업 (TypeScript)
│       ├── [component-name].css     # 독립된 컴포넌트 스타일 (CSS)
│       └── tests/                   # 테스트 파일 전용 격리 디렉토리
│           └── [component-name].test.ts  # 컴포넌트 테스트 스펙 (TypeScript)
└── dist/                            # 빌드 산출물 전용 디렉토리 (소스 폴더 오염 방지)
    └── components/
        └── [component-name]/
            ├── [component-name].js
            ├── [component-name].d.ts
            └── tests/
                └── [component-name].test.js
```

### ⚙️ 빌드 산출물 격리 설정 (tsconfig.json)
컴파일된 JavaScript 파일이 원본 TypeScript 파일과 같은 폴더에 생성되어 프로젝트를 오염시키는 것을 방지하기 위해 `tsconfig.json` 파일에서 출력 디렉토리를 지정합니다.
- `compilerOptions.outDir`: `"./dist"`
- `compilerOptions.rootDir`: `"./"`

### ⚙️ 테스트 러너 설정 (web-test-runner.config.js 및 package.json)
테스트 파일 또한 빌드 산출물인 `dist/` 내부의 빌드된 테스트 코드를 실행하도록 경로를 조정합니다.
- **`web-test-runner.config.js`**: `files: 'dist/**/*.test.js'`
- **`package.json`**: `"test": "tsc && web-test-runner \"dist/**/*.test.js\" --node-resolve"`

---

## 2. TypeScript & CSS Modules Integration (CSS 연동 모듈 설정)

외부 `.css` 파일을 TypeScript가 올바르게 인지하고 타입 오류 없이 임포트할 수 있도록, 프로젝트 내 공통 타입 선언 파일(예: `global.d.ts` 또는 `declarations.d.ts`)에 다음과 같이 CSS 모듈 선언을 추가합니다.

```typescript
// project-root/declarations.d.ts (또는 global.d.ts)
declare module '*.css' {
  const content: CSSStyleSheet;
  export default content;
}
```

---

## 3. 표준 스캐폴드 템플릿 (Scaffold Template)

새로운 컴포넌트 생성 시 아래의 구조를 그대로 복사하여 작성의 뼈대로 사용합니다.

### 📄 [component-name].css (외부 스타일 시트)
```css
/* 컴포넌트 호스트 엘리먼트 스타일 정의 */
:host {
  display: block;
}

/* 웹 접근성 (a11y) 보장을 위한 공통 키보드 포커스 스타일 */
:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}
```

### 📄 [component-name].ts (컴포넌트 컨트롤러)
```typescript
import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import styles from './[component-name].css' with { type: 'css' };

/**
 * [컴포넌트 역할 및 주요 기능에 대한 한 줄 설명]
 * 
 * @element [custom-tag-name]
 * @fires [event-name] - [이벤트 발생 조건 및 디테일 데이터 설명]
 * 
 * @example
 * ```html
 * <[custom-tag-name]></[custom-tag-name]>
 * ```
 */
@customElement('[custom-tag-name]')
export class ClassName extends LitElement {
  // 브라우저 표준 Constructable Stylesheets 기법을 이용한 외부 CSS 적용
  static styles = [styles];

  /**
   * [공개 프로퍼티 설명]
   * - 기본값: ''
   * - 허용값: string
   */
  @property({ type: String }) title: string = '';

  /**
   * [내부 리액티브 상태 설명]
   * - 기본값: 0
   * - 허용값: number
   */
  @state() private _value: number = 0;

  /**
   * [이벤트를 핸들링하거나 동작을 유발하는 비즈니스 로직 메소드 설명]
   * @param param - [매개변수 설명]
   * @returns {void}
   */
  public handleAction(param: string): void {
    // 로직 수행...
    this.dispatchEvent(new CustomEvent('event-name', {
      detail: { param },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * LitElement의 렌더링 메서드입니다.
   * @returns {TemplateResult} 렌더링할 HTML 템플릿 결과
   */
  render(): TemplateResult {
    return html`
      <div>
        <h1>${this.title}</h1>
        <button @click="${() => this.handleAction('action')}">Click</button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    '[custom-tag-name]': ClassName;
  }
}
```

### 📄 tests/[component-name].test.ts (컴포넌트 단위 테스트)
```typescript
import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import '../[component-name].js'; // 빌드 폴더 기준 임포트 보장
import { ClassName } from '../[component-name].js';

describe('ClassName Component', () => {
  it('should render with default values', async () => {
    const el = await fixture<ClassName>(html`<[custom-tag-name]></[custom-tag-name]>`);
    expect(el.title).to.equal('');
  });

  it('should pass accessibility standards', async () => {
    const el = await fixture<ClassName>(html`<[custom-tag-name]></[custom-tag-name]>`);
    await expect(el).to.be.accessible();
  });
});
```

---

## 4. 실전 가상 예제: 텍스트 카운터 컴포넌트 (`lit-counter`)

위 뼈대 규칙을 준수하여 작성한 가상의 `lit-counter` 컴포넌트 예제 구조입니다.

### 📁 `components/lit-counter/lit-counter.css`
```css
:host {
  display: inline-block;
  font-family: sans-serif;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 16px;
  background-color: #f9f9f9;
}

.counter-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

button {
  padding: 8px 12px;
  font-size: 1rem;
  cursor: pointer;
}

button:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

.value {
  font-size: 1.25rem;
  font-weight: bold;
}
```

### 📁 `components/lit-counter/lit-counter.ts`
```typescript
import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import styles from './lit-counter.css' with { type: 'css' };

/**
 * 간단한 숫자 카운터 기능을 제공하는 Lit 기반 웹 컴포넌트입니다.
 * 
 * @element lit-counter
 * @fires counter-change - 카운터 값이 변경될 때 발생하며, detail에 current 값을 포함합니다.
 * 
 * @example
 * ```html
 * <lit-counter .initialValue="${5}"></lit-counter>
 * <script>
 *   const counter = document.querySelector('lit-counter');
 *   counter.addEventListener('counter-change', (e) => {
 *     console.log('변경된 값:', e.detail.current);
 *   });
 * </script>
 * ```
 */
@customElement('lit-counter')
export class LitCounter extends LitElement {
  // 외부 CSS 파일 연동
  static styles = [styles];

  /**
   * 카운터의 초기값 설정 프로퍼티
   * - 기본값: 0
   * - 허용값: 모든 숫자 (number)
   */
  @property({ type: Number }) initialValue: number = 0;

  /**
   * 컴포넌트 내부에서 상태를 가지는 현재의 카운트 값
   * - 기본값: 0 (initialValue 값으로 생성 시점 동기화)
   * - 허용값: 모든 숫자 (number)
   */
  @state() private _count: number = 0;

  /**
   * 컴포넌트 생성자 및 초기 상태 반영
   */
  constructor() {
    super();
    this._count = this.initialValue;
  }

  /**
   * 컴포넌트의 수명 주기가 연결될 때 initialValue 상태를 바인딩합니다.
   * @returns {void}
   */
  connectedCallback(): void {
    super.connectedCallback();
    this._count = this.initialValue;
  }

  /**
   * 카운트의 숫자를 증가시키고 이벤트를 발송합니다.
   * @returns {void}
   */
  public increment(): void {
    this._count += 1;
    this._dispatchChange();
  }

  /**
   * 카운트의 숫자를 감소시키고 이벤트를 발송합니다.
   * @returns {void}
   */
  public decrement(): void {
    this._count -= 1;
    this._dispatchChange();
  }

  /**
   * 변경된 상태값을 이벤트를 통해 외부에 알리는 private 헬퍼 메소드입니다.
   * @returns {void}
   */
  private _dispatchChange(): void {
    this.dispatchEvent(new CustomEvent('counter-change', {
      detail: { current: this._count },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * LitElement의 렌더링 메서드입니다. 카운터 레이아웃을 생성합니다.
   * @returns {TemplateResult} 렌더링할 HTML 템플릿 결과
   */
  render(): TemplateResult {
    return html`
      <div class="counter-container">
        <button class="dec-btn" @click="${this.decrement}">-</button>
        <span class="value" role="status" aria-live="polite">${this._count}</span>
        <button class="inc-btn" @click="${this.increment}">+</button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-counter': LitCounter;
  }
}
```

### 📁 `components/lit-counter/tests/lit-counter.test.ts`
```typescript
import { html } from 'lit';
import { fixture, expect, elementUpdated } from '@open-wc/testing';
import '../lit-counter.js'; // 컴포넌트 임포트
import { LitCounter } from '../lit-counter.js';

describe('LitCounter Component', () => {
  it('should initialize with initial value', async () => {
    const el = await fixture<LitCounter>(html`<lit-counter .initialValue="${5}"></lit-counter>`);
    const valueEl = el.shadowRoot!.querySelector('.value')!;
    expect(valueEl.textContent?.trim()).to.equal('5');
  });

  it('should increment value on + click', async () => {
    const el = await fixture<LitCounter>(html`<lit-counter></lit-counter>`);
    const incBtn = el.shadowRoot!.querySelector('.inc-btn') as HTMLButtonElement;
    incBtn.click();
    await elementUpdated(el);
    const valueEl = el.shadowRoot!.querySelector('.value')!;
    expect(valueEl.textContent?.trim()).to.equal('1');
  });

  it('should decrement value on - click', async () => {
    const el = await fixture<LitCounter>(html`<lit-counter .initialValue="${3}"></lit-counter>`);
    const decBtn = el.shadowRoot!.querySelector('.dec-btn') as HTMLButtonElement;
    decBtn.click();
    await elementUpdated(el);
    const valueEl = el.shadowRoot!.querySelector('.value')!;
    expect(valueEl.textContent?.trim()).to.equal('2');
  });

  it('should pass accessibility standards', async () => {
    const el = await fixture<LitCounter>(html`<lit-counter></lit-counter>`);
    await expect(el).to.be.accessible();
  });
});
```
