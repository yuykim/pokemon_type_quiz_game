# pokemon_type — 타입 상성 연습

기획: `doc/pokemon_type_game_design_spec.md`  
실행 파일: `web/` 정적 사이트 (Vanilla JS ES modules).   
depoly addr : https://pokemon-type-quiz-game-git-main-yyoungs-projects.vercel.app/.

## 실행 방법

ES 모듈은 `file://`에서 브라우저 정책에 막힐 수 있으므로, **`web` 폴더를 루트로 로컬 서버**를 띄운 뒤 접속하세요.

### 윈도우 원클릭

- 루트에서 `start-web.bat` 더블클릭
- 또는 PowerShell에서 `./start-web.ps1`

### 수동 실행

```bash
cd web
npx --yes serve .
```

브라우저에서 표시된 주소(예: `http://localhost:3000`)로 열면 됩니다.

Python 사용 시:

```bash
cd web
python -m http.server 8080
```

그다음 `http://localhost:8080` 접속.

## 구조

- `web/index.html` — 진입
- `web/css/` — 토큰, 레이아웃, 컴포넌트, 타일, 모바일
- `web/js/` — 타입 데이터, 상성표, 배율·최적해, 세션, 화면별 UI

모바일: 뷰포트·최소 터치 영역(`44px`)·좁은 화면에서 타입 그리드 3열 등 반영.
