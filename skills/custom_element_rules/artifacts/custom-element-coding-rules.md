# Skill: Custom Element Standard Coding Rules

## Description
이 문서는 Lit 및 표준 Web Components 개발 시 반드시 지켜야 하는 타입스크립트 기반 클래스 상속 및 웹 접근성(a11y) 가이드라인입니다.

## 1. TypeScript & Class Inheritance (타입스크립트 및 클래스 상속)
- **LitElement 상속**: 모든 커스텀 엘리먼트는 `LitElement`를 상속받는 `class` 형태로 작성해야 합니다.
- **데코레이터 활용**: `@customElement`, `@property`, `@state` 등의 데코레이터를 사용하여 직관적이고 깔끔한 클래스 구조를 유지합니다.
- **타입 정의**: 모든 프로퍼티, 상태, 메서드의 매개변수 및 반환 값에 대해 명시적으로 TypeScript 타입을 정의합니다. (예: `number`, `boolean`, `Event` 등)
- **라이프사이클 오버라이딩**: `connectedCallback`, `disconnectedCallback`, `updated` 등의 메서드를 오버라이딩할 때는 반드시 `super.connectedCallback()` 등을 먼저 호출하여 부모 클래스의 동작을 보장합니다.
- **Private/Protected 접근 제어자**: 외부에서 접근할 필요가 없는 내부 상태나 메서드는 `private` 또는 `protected` 키워드를 사용하여 캡슐화를 유지합니다.

## 2. Web Accessibility (웹 접근성 - a11y)
웹 표준 접근성을 준수하여 스크린 리더 발화, 포커스, 고대비 모드를 완벽히 지원해야 합니다.
- **시맨틱 태그 및 ARIA 속성**:
  - 가능한 한 시맨틱 HTML 태그(`<button>`, `<nav>`, `<main>` 등)를 사용하여 컴포넌트를 구성합니다.
  - 시맨틱 태그로 표현이 불가능한 커스텀 UI의 경우, 적절한 `role` (예: `role="button"`, `role="alert"`)과 ARIA 속성(`aria-label`, `aria-expanded`, `aria-hidden` 등)을 추가하여 스크린 리더가 명확히 맥락을 읽을 수(발화할 수) 있도록 합니다.
- **키보드 포커스 관리**:
  - 마우스 클릭 외에 `Tab` 키를 통한 포커스 이동이 가능해야 합니다. 인터랙티브 요소는 탭 이동이 가능해야 하며, 커스텀 컨테이너가 포커스를 받아야 하는 경우 `tabindex="0"`을 설정합니다.
  - 모달이나 팝업 동작 시 키보드 포커스 트랩(Focus Trap)을 구현하여 포커스가 논리적으로 흐르도록 합니다.
  - 동작을 유발하는 요소는 `Enter` 및 `Space` 키 입력(`keydown` 이벤트)에도 반응하도록 구현합니다.
- **포커스 스타일 및 고대비 지원**:
  - `:focus-visible` CSS 선택자를 사용하여 포커스된 요소의 시각적 피드백(뚜렷한 Outline 등)을 명확히 제공합니다.
  - 고대비 모드(High Contrast Mode) 사용자를 배려하여 텍스트와 배경의 명도 대비를 WCAG 표준(최소 4.5:1 이상)에 맞게 구성하며, 색상 변화에만 의존하여 정보를 전달하지 않도록 주의합니다.

## 3. Code Documentation (TypeDoc 표준 문서화)
모든 컴포넌트, 프로퍼티, 메서드, 이벤트는 TypeDoc(JSDoc)이 정상적으로 파싱할 수 있도록 표준 블록 주석(`/** ... */`)을 준수하여 문서화해야 합니다.
- **클래스 및 엘리먼트 주석**: 클래스 선언부 상단에 컴포넌트의 역할과 사용법을 작성하며, 반드시 `@element [커스텀-태그명]` 태그를 명시하여 커스텀 태그 이름을 문서화합니다.
- **프로퍼티 및 상태 주석**: `@property` 및 `@state` 데코레이터가 붙은 필드 상단에 해당 속성의 목적과 기본값, 허용되는 값을 설명합니다.
- **이벤트 주석**: 컴포넌트가 외부로 디스패치하는 이벤트는 클래스 주석 부분에 `@fires [이벤트명] - [설명]` 형식으로 명시하여 개발자가 어떤 이벤트를 리슨할 수 있는지 알립니다.
- **메서드 주석 및 타입**: 모든 메서드(public, protected, private)는 매개변수와 반환값의 타입을 명시적(TypeScript Type)으로 선언해야 하며, `@param` 및 `@returns` 태그를 활용하여 해당 의미를 JSDoc에 명확히 기술해야 합니다.
- **사용 예제 (Usage Example)**: 컴포넌트 클래스 상단 주석에 `@example` 태그를 사용하여, HTML이나 JavaScript에서 해당 커스텀 엘리먼트를 어떻게 사용하는지 구체적인 코드 스니펫(예제)을 반드시 포함해야 합니다.
