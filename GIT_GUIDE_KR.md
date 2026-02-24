# Git 리모트 설정 및 안내

이미 `origin`이라는 이름의 리모트 설정이 존재해서 오류가 발생했습니다. 제가 기존의 `origin` 주소를 새 저장소 주소로 업데이트해 두었습니다.

## 해결 방법

이미 `origin`이 존재할 때는 `git remote add` 대신 아래 명령어를 사용해야 합니다:

```powershell
git remote set-url origin https://github.com/jiha-hub/antigravityblog
```

## 다음 단계

이제 코드를 깃허브에 올리시려면 다음 명령어를 순서대로 입력하세요:

1. **파일 업로드 준비:**
   ```powershell
   git add .
   ```

2. **커밋 메시지 작성:**
   ```powershell
   git commit -m "Initial commit"
   ```

3. **최종 푸시:**
   ```powershell
   git push -u origin main
   ```

현재 브랜치가 `main`인 것을 확인했습니다. 만약 다른 브랜치를 사용하신다면 `main` 대신 해당 브랜치 이름을 적어주세요.
