## Gradios Wiki

gradios wiki 입니다.





### Gradios 실행 방법

Gradios는 Node.js의 gulp를 기반으로 동작합니다. 실행하기 위해서는 Node.js의 설치와 실행이 필요합니다.



#### Node.js 설치
![wiki_nodejs_01](https://user-images.githubusercontent.com/43108674/56501866-613f4600-654b-11e9-823d-b320a7d19e00.PNG)

Node.js 홈페이지 [[링크]](https://nodejs.org/ko/) 에 들어가서 사용중인 운영체제에 맞는 LTS 버전을 다운받으면 됩니다.

설치는 어렵지 않으니 생략하겠습니다.



#### gradios download

gradios를 실행하려면 당연히 gradios 파일들이 필요합니다. 다운을 받는 방법은 크게 두 가지 입니다.



* ***Git Clone을 통한 다운로드 (git 연동도 됨)***

  1. GitKraken 첫 페이지에서 Open a repo를 클릭합니다.

     ![wiki_gitkraken_01](https://user-images.githubusercontent.com/43108674/56501868-613f4600-654b-11e9-99ca-7d2b247dea38.PNG)

  2. clone - github.com - (gradios)를 선택하고, 다운받을 경로를 지정해 줍니다.

     ![wiki_gitkraken_02](https://user-images.githubusercontent.com/43108674/56501865-60a6af80-654b-11e9-91c7-fdfaac1cab28.PNG)

  3. 잠시 후 다운로드가 완료되면 확인할 수 있습니다.

     

* ***Github 홈페이지에서 ZIP 형태로 다운로드***

![wiki_github_01](https://user-images.githubusercontent.com/43108674/56501867-613f4600-654b-11e9-8fd4-4e8bbab22ea8.PNG)

1. 저 버튼을 찾아 누르면 됩니다. 압축은 풀 수 있을 것입니다.



#### npm 설치 및 실행

[npm](https://ko.wikipedia.org/wiki/Npm_(소프트웨어)) 은 노드 패키지 명령어로써, Node.js를 위한 패키지 관리자 입니다. 이를 통해 node. js의 라이브러리를 다운하는 등의 명령을 할 수 있습니다. 윈도우는 명령프롬프트(CMD)를 관리자 권한으로 실행시켜 진행하면 됩니다. (window git으로 해도 됩니다.)



1. 아래와 같은 명령어를 통해 해당 디렉토리로 이동합니다. (저는 바탕화면에 있습니다.)

   ```
   cd c://user/(유저 이름)/Desktop/(바탕화면에 있는 폴더/경로 이름)
   ```

   

2. 아래 명령어를 통해 모듈들을 설치합니다.

   ```
   npm install
   ```

   

3. 아래 명령어를 통해 gulp를 설치합니다.

   ```
   npm install -g gulp
   ```

4. 아래 명령어를 통해 gulp를 실행합니다.

   ```
   gulp
   ```
   또는
   ```
   npm start
   ```



정상적으로 실행이 완료 되었다면, http://localhost:3000 이나 http://127.0.0.1:3000 으로 접속하면 됩니다.





#### ERRORS

npm install, start 과정에서 생길 수 있는 문제들입니다. node.js를 설치하지 않아 발생한 문제는 제외했습니다.



* port 3000 already used

  npm start를 이미 한 경우입니다. 재 실행을 하기 위해서 (경로를 바꾼다던지)는 npm을 정지하고, 재 실행하시면 됩니다. (잠시 기다려야 할 수 있습니다.)

* WARNING이 뜨는 경우

  package.json이 없는 경우입니다. 최신 파일의 경우 문제가 일어나지 않습니다.
