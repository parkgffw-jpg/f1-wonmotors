# 작업 규칙 (반드시 준수)

## 사용자 정보
- 사용자는 개발자가 아님. 설명은 쉬운 말로, 명령마다 무엇을 하는지 한 줄로 먼저 설명
- Vercel 가입 이메일: [지인 Vercel 가입 이메일]
- GitHub 계정: [지인 GitHub 아이디]

## Git 규칙
- 커밋 이메일은 반드시 Vercel 가입 이메일과 같게 설정. 이 저장소에만 적용 (git config --local), --global 사용 금지
  (무료 Hobby 플랜은 커밋 작성자 이메일이 계정과 다르면 배포가 Blocked 됨)
- 커밋 메시지에 Co-Authored-By 줄을 넣지 말 것. 메시지는 한 줄
- 커밋 직후 git log -1 --format="%h | %ae | %B" 로 작성자와 메시지 확인
- .gitignore 에 항상 포함: node_modules, .next, .vercel, .env*, 임시 작업 파일(_로 시작하는 파일)
- .env 파일이 저장소에 올라간 적 있는지 git ls-files 로 확인. 올라가 있으면 삭제하지 말고 보고

## 이미지 규칙 (배포 용량 초과 방지)
- 휴대폰 원본 사진을 public 폴더에 그대로 넣지 말 것
- public 에 넣기 전에 가로 최대 2000px, WebP 또는 JPG 품질 80 수준으로 최적화
- 원본 사진은 프로젝트 폴더 밖에 따로 보관
- 이미지 파일명은 영문 소문자·숫자·하이픈만 사용

## 배포 규칙 (Vercel)
- 기본 배포 방식은 GitHub 연결 자동배포 (push 하면 자동 배포). vercel --prod 를 반복 실행하지 말 것
  (배포할 때마다 저장 용량이 쌓여 무료 한도 10GB를 넘으면 새 배포가 막힘)
- 배포 전 확인: git status 에 미커밋 변경 없음, npm run build 성공
- 배포가 실패하면 재시도 반복 금지. 오류 메시지 원문 전체를 보고하고 멈출 것
- "Not authorized" 또는 "Blocked" 가 나오면 1) 커밋 이메일 2) Vercel 대시보드 Usage의 Deployment Storage 초과 여부를 먼저 확인하도록 사용자에게 안내
- 한 달에 한 번 Vercel 대시보드 Usage 확인을 사용자에게 권유

## 절대 금지 명령
- vercel remove <프로젝트명>, vercel project rm, vercel domains rm (프로젝트나 도메인 전체가 삭제됨)
- 배포 정리가 필요하면: 현재 도메인 연결 배포와 직전 배포 1건은 보호 → 삭제 목록 파일 작성·검증 → 1건 시험 삭제 후 사이트 확인 → 나머지를 URL 단위로 삭제
- vercel login, vercel link 는 사용자 확인 없이 실행 금지

## Windows 환경
- PowerShell 에서는 curl 대신 curl.exe 사용
- 사이트 확인은 curl.exe -I <주소> 로 200 응답 확인

# [초기 점검] (조회만, 수정·배포 금지)
1. git 저장소 여부, 원격 저장소 주소
2. git config --local user.email 값이 Vercel 가입 이메일과 같은지
3. .gitignore 에 위 필수 항목이 모두 있는지 (없는 항목은 추가해도 되는지 물어볼 것)
4. git ls-files 로 .env 또는 .vercel 파일이 올라가 있는지
5. public 폴더 전체 용량과 1MB 넘는 이미지 파일 목록
6. vercel whoami, .vercel/project.json 의 프로젝트명
결과를 "항목: 결과" 형태로 보고
