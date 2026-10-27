# 직접 상담 접수 연결

## 현재 상태

이 브랜치는 고객이 한 화면에서 작성하고 제출하는 화면과 서버 코드를 준비한 버전입니다. 실제 네이버 메일/카카오 알림톡 발송은 아직 연결하거나 검증하지 않았습니다. `CONSULTATION_ENABLED=false`가 기본이며 연결 전에는 기존 운영 화면을 교체하지 않습니다.

- 이름·연락처·동의 1회 입력 → 선택한 스타일/시공사례/가구 구성·수량/공간 치수·메모 자동 포함
- 접수 기록 저장 → 담당자 메일 발송 요청 → 담당자 카카오 알림톡 발송 요청
- 고객에게 복사·붙여넣기, 메일 앱 실행, 다른 폼 재작성을 요구하지 않음
- 메일 서버가 수신을 승인한 경우에만 접수 성공 응답. 이는 수신함 도착·열람 보장은 아님
- 카카오는 메일 수신함을 감시하지 않음. 이 사이트 상담 메일 발송 성공 직후에만 알림을 요청함
- 카카오 공급자의 요청 수락과 휴대폰 도착은 별개이며, 발송내역에서 최종 결과를 확인해야 함

## 필요한 연결

실제 값은 Vercel `seeline` 프로젝트의 **Settings → Environment Variables**에만 입력합니다. 로그인 비밀번호/앱 비밀번호/API Secret을 채팅이나 GitHub에 올리지 않습니다. `.env.example`에는 변수 이름과 공개 기본값만 들어 있습니다.

1. **네이버 메일**
   - 기존 담당자 주소: `truenature00@naver.com`
   - 네이버 2단계 인증 및 외부 메일 프로그램 SMTP 사용을 설정하고 앱 비밀번호 발급
   - `SMTP_USER`, `SMTP_APP_PASSWORD`, `CONSULTATION_TO` 설정
   - 서버는 `smtp.naver.com:465` TLS 연결 사용. 발신·수신 주소는 서버 설정으로 고정되며 고객이 지정할 수 없음
2. **접수 저장소**
   - Vercel Marketplace에서 소유자 계정의 영구 Upstash Redis 연결
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` 설정
   - 시험용 72시간 임시 데이터베이스는 운영에 사용하지 않음
3. **자동 입력 방지**
   - Cloudflare Turnstile에서 `seeline-rho.vercel.app`을 허용 호스트로 등록
   - `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` 설정. 실제 운영 키를 사용하며 테스트용 항상 통과 키를 운영에 넣지 않음
4. **대표자 카카오 알림톡**
   - SOLAPI 계정에서 `주식회사 창원디자인시선` 비즈니스 채널 연결 및 아래 정보성 템플릿 승인
   - 채널 공개 URL `https://pf.kakao.com/_xerCWX` 자체는 API 발신 권한이 아님
   - `SOLAPI_API_KEY`, `SOLAPI_API_SECRET`, `SOLAPI_PF_ID`, `SOLAPI_TEMPLATE_ID` 설정
   - `CONSULTATION_OWNER_MOBILE`: 알림을 받을 대표자 휴대폰 번호(숫자만). 현재 미확인. 고객 입력 번호로 알림을 보내지 않음
   - 발송은 사용량에 따른 공급자 과금 대상. 본 작업에서는 결제·충전·유료 발송을 하지 않았음. SMS 대체 발송은 꺼둠
5. **최종 활성화**
   - `CONSULTATION_ORIGIN=https://seeline-rho.vercel.app`
   - 양쪽 서비스의 실제 수신 테스트와 운영 동의를 확인한 뒤 `CONSULTATION_ENABLED=true`로 설정하고 재배포
   - 도메인 변경 시 Origin과 Turnstile 허용 호스트도 함께 변경
   - 비밀값을 등록한 것만으로 발송 성공을 확정하지 말고 실제 메일 수신함과 휴대폰 알림을 모두 확인

## 카카오 승인 요청용 템플릿

아래 문구는 제출 초안이며 카카오가 승인한 템플릿이 아닙니다. 승인된 템플릿 변수명과 코드의 변수가 정확히 일치해야 합니다.

```text
[디자인시선 상담 접수]
새로운 인테리어 상담 신청이 접수되었습니다.

접수번호: #{접수번호}
접수시간: #{접수시간}

상담 내용은 담당자 이메일에서 확인해 주세요.
```

## 검증과 오류 대응

- `npm ci`, `npm test`, `npm run build`
- 실제 계정 연결 전 테스트는 모의 메일/알림 전송으로 실행. 외부 메시지를 보내지 않음
- `GET /api/consultation`: 활성 여부와 공개 Turnstile 키만 반환
- `POST /api/consultation`: 허용 Origin/JSON/본문 길이/이름·전화·동의/Turnstile 호스트·action 검증
- 서버 간 공용 Redis 잠금과 요청 ID로 중복 제출 억제. Redis 장애 시 발송하지 않음
- SMTP 거절은 실패로 기록하고 재시도 가능. SMTP 응답 유실은 `uncertain`으로 기록해 임의로 재발송하지 않음
- 카카오 요청 실패는 이미 보낸 메일을 다시 보내지 않고 `kakaoStatus=needs_review`로 기록. Vercel 로그에는 접수 ID와 오류 유형만 남기며 고객 개인정보/키/본문은 출력하지 않음
- 자동 재시도 작업은 없음. 운영자는 SOLAPI 발송내역에서 접수 ID를 대조한 후 실패 건을 확인해야 함. 네트워크 시간초과 건은 이미 발송됐을 수 있어 무조건 다시 보내지 않음
- Redis 접수 키: `seeline:lead:<UUID>`. 고객 공개 조회 API는 없음
- 저장소 접수 자료는 90일 TTL. 이메일 사본은 메일 계정에서 별도로 90일 삭제 정책을 운영해야 하며 계약 자료로 전환된 경우 별도 관리. 공개 전 개인정보 안내와 운영 보관 정책을 일치시킬 것
- `scripts/build.mjs`는 브라우저 파일만 `public/`에 복사. 서버 코드, 환경변수, 테스트, 이 문서는 공개 정적 파일에서 제외

## 공식 문서

- 네이버 SMTP: https://help.naver.com/service/30029/contents/21341
- Vercel SMTP: https://vercel.com/kb/guide/serverless-functions-and-smtp
- Nodemailer: https://nodemailer.com/smtp
- Upstash REST: https://upstash.com/docs/redis/features/restapi
- Turnstile 검증: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- SOLAPI 알림톡: https://solapi.com/developers/api/messages-ata
- SOLAPI 인증: https://solapi.com/developers/api/authentication-api-key
