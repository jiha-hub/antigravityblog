# 🚀 깃허브 배포 마스터 가이드

아래 단계를 **순서대로 하나씩** 따라하시면 성공적으로 배포할 수 있습니다.

### 1단계: 변경사항 저장 (매우 중요!)
현재 수정 중인 파일들을 먼저 깃에 등록해야 합니다.
```powershell
git add .
git commit -m "가이드 업데이트 및 코드 정리"
```

### 2단계: 깃허브 저장소 연결 확인 (이미 되어 있지만 확인용)
```powershell
git remote set-url origin https://github.com/jiha-hub/antigravityblog
```

### 3단계: 깃허브의 변경사항과 내 코드 합치기
이 과정에서 `non-fast-forward` 관련 오류를 방지합니다.
```powershell
git pull origin main --rebase --allow-unrelated-histories
```
> [!TIP]
> 만약 여기서 'README.md' 충돌 메시지가 나오면, 제가 이미 해결해 두었으니 다음 명령어를 입력하세요:
> `git add README.md`
> `git rebase --continue`

### 4단계: 최종 푸시 (배포 완료!)
```powershell
git push -u origin main
```

### 💡 자주 발생하는 오류 해결
**"You have unstaged changes" 오류가 난다면?**
- 1단계를 거치지 않아서 그렇습니다. 반드시 `git add .`과 `git commit`을 먼저 해주세요.

**"rejected (non-fast-forward)" 오류가 난다면?**
- 3단계(`git pull ...`)를 건너뛰어서 그렇습니다. 3단계를 먼저 실행해 주세요.

**"Application error (405)"가 발생한다면?**
1. **환경 변수 체크**: Vercel 설정에서 `NEXT_PUBLIC_SITE_URL`이 정확한지 확인하세요. (예: `https://...vercel.app` - 끝에 `/`가 없어야 합니다.)
2. **배포 로그 확인**: Vercel 대시보드의 **Logs** 탭에서 빨간색 에러 메시지가 있는지 확인해 보세요.
3. **새로고침**: 환경 변수를 고쳤다면 반드시 **Redeploy**를 수행해야 합니다.
