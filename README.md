# HorizonMap-fork

HorizonMap의 포크 버전 입니다. 다양한 기능과 버그 수정을 적용 하였습니다.


## 온라인 버전

 원본 리포지토리의 실행은 여기서 하실 수 있습니다. [여기](https://maseuko.pl/soft/horizonmap/).

 이 리포지토리의 실행은 여기서 하실 수 있습니다. [여기](https://pepsisoupp.github.io/)

## 직접 소스로부터 실행

1. `Node.js` 그리고 `npm` 이 설치되어 있는지 확인합니다.

2. 이 리포지토리를 Clone 합니다.

        git clone https://github.com/pepsisoupp/horizonmap-fork


3. 프로젝트의 폴더에서 종속성을 설치합니다.

        cd horizonmap
        npm install


4. 개발 서버를 실행합니다.

        npm start

    또는 프로젝트를 빌드합니다:
    
        npm run build

## 데이터 출처
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Mapzen](https://www.mapzen.com/blog/terrain-tile-service/)
- [Google Maps](https://developers.google.com/maps/documentation/tile)

## 원작자

masuo / izawartka


## Mapbox 지형 데이터
Mapbox의 API 토큰을 .env 파일에 입력하면 Mapbox의 고품질 지형 데이터를 사용 하실 수 있습니다. 
```
REACT_APP_MAPBOX_ACCESS_TOKEN=이곳에 토큰 입력
```
토큰이 정상적으로 입력되었다면 Mapbox의 지형 데이터를 사용하게 됩니다. 
토큰이 무효하거나 입력되지 않았다면 자동으로 TERRARIUM의 지형 데이터를 받아오게 됩니다.

