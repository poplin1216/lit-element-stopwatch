# Skill: Web Component TDD Workflow

## Description
이 Skill은 에이전트가 토큰을 최소한으로 사용하면서 Lit 기반 웹 컴포넌트를 설계, 테스트, 구현(TDD)하는 최적화된 자가 치유(Self-healing) 워크플로우를 강제하기 위한 지침입니다.

## Prerequisites
- 프로젝트 내에 Lit, Vite, @web/test-runner, @open-wc/testing 환경이 구성되어 있어야 합니다.

## Execution Steps

### Step 1: 분석 및 설계 (Analysis and Design)
- **행동**: 코드를 즉시 작성하지 마십시오. 요구사항을 분석하여 컴포넌트 상태(State), 속성(Properties), 이벤트(Events)를 정의합니다.
- **출력물**: `implementation_plan.md` 아티팩트를 작성하고 사용자에게 리뷰를 요청합니다.
- **제어**: 사용자 승인(Approve/Continue) 전까지 대기합니다.

### Step 2: TDD 테스트 우선 작성 (Red Phase)
- **행동**: 설계된 컴포넌트를 검증할 `[component-name].test.ts` 파일을 작성합니다.
- **가이드라인**: 
  - `@open-wc/testing`의 `fixture`, `expect`, `html`, `aTimeout`, `oneEvent` 등을 적극 활용합니다.
  - 시간/타이머 테스트 시 브라우저 헤드리스 환경을 고려하여 `requestAnimationFrame` 모킹보다는 `setInterval`과 `aTimeout` 기반의 실제 시간 대기 테스트를 권장합니다.
  - 정상 동작(Happy path)과 에지 케이스(예: 중복 실행, 비활성 시 실행)를 모두 커버합니다.

### Step 3: 자가 치유 구현 루프 (Self-Healing Loop - Green Phase)
- **행동**: 테스트 파일 작성 후, 빈 뼈대 컴포넌트(`*.ts`)를 생성하고 터미널에서 `npm run test`를 실행하여 의도된 **실패(Red)**를 확인합니다.
- **행동**: 컴포넌트 로직을 구현합니다. 로직 구현 후 다시 테스트를 실행합니다.
- **제어**: 터미널 출력(오류 로그)을 바탕으로 스스로 코드를 수정하고 다시 테스트하는 루프를 모든 테스트가 통과할 때까지 반복합니다.

### Step 4: 시각적 검증 및 완료 (Verification & Demo)
- **행동**: 모든 단위 테스트가 통과되면 `walkthrough.md` 아티팩트에 개발 내역을 기록합니다.
- **옵션**: 사용자가 데모를 요청한 경우, `index.html`을 만들고 `npm run dev`로 서버를 띄운 뒤 `browser_subagent` 도구를 호출하여 버튼 클릭 등 시각적 렌더링 및 작동을 녹화(Record)하여 검증합니다.

## Refactoring Pipeline (구조적 변경 제약)

기존에 작성된 Custom Element를 리팩토링할 때, 내부 구현의 단순 최적화를 넘어선 **구조적인 변경**(예: 컴포넌트 분리, 상태 관리 방식 변경, 공개 API 구조 변경 등)이 필요한 경우, 임의로 코드를 수정해서는 안 되며 다음 파이프라인을 엄격히 준수합니다.

1. **사전 승인 (Plan & Approve)**: 코드를 즉시 변경하지 마십시오. 구조적 변경의 이유, 예상되는 아키텍처 변화, 그리고 기존 코드에 미치는 영향을 담은 `implementation_plan.md` 아티팩트를 작성하여 사용자에게 리뷰와 승인을 먼저 요청합니다.
2. **테스트 기반 설계 (Red Phase)**: 사용자의 승인이 완료되면, 변경된 구조에 맞추어 기존 테스트 코드를 수정하거나 새로운 테스트 코드를 우선 작성하여 테스트 실패(Red)를 확인합니다.
3. **리팩토링 구현 (Green Phase)**: 새로운 테스트가 통과하도록 코드를 리팩토링하고, 터미널 오류 로그를 기반으로 자가 치유 루프를 실행하여 모든 테스트를 통과시킵니다.
4. **결과 검증 (Verification)**: 리팩토링 완료 후 `walkthrough.md` 아티팩트를 업데이트하여 변경 내역과 검증 결과를 사용자에게 보고합니다.
