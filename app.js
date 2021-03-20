const express = require("express");
const app = express();
const path = require("path");
// console.log("==============================> ", __dirname);
// console.log(
//   "==============================> ",
//   path.join(__dirname, "public/html")
// );
const createError = require("http-errors");
const { zeroPlus, nowTime } = require("./modules/utils");

app.listen(3000, () => {
  console.log("=====================");
  console.log("http://127.0.0.1:3000");
  console.log("=====================");
});

// 서버 완성
app.use("/", express.static(path.join(__dirname, "./public"))); // 이폴더를 정적 폴더로 지정, http://localhost:3000/img/dog.png 이힛 public 폴더가 root가 되어라~~~~
// static으로 만들지 않은 경로는 브라우저에서 폴더에 접근하지 못함.

// client는 uploads라는 폴더로 접근하지만 진짜는 storages!
app.use("/uploads", express.static(path.join(__dirname, "./storages")));

app.use((req, res, next) => {
  // 주소줄이 없으니까 무조건 실행됨 이런 친구들을 미들웨어라고 하고 이런 녀석들의 역할은 라우터 단으로 넘어가기 전에 req나 res를 가공하는데 사용한다.

  // console.log("++++++++++++++++++++++++", req, res, next);
  req.nowTime = new Date();
  next();
});

app.get("/", function (req, res, next) {
  // 경로 위에 부터 순차적으로
  console.log("ddddddddddddddd", req.nowTime);
  res.send("<h1>Hello, Express</h1>");
});

// app.get, app.post 같은 친구들은 미들웨어 개념
// 익스프레스는 클라이언트로 부터 요청이 들어오면 위에서 부터 쭉 내려오면서 해석함

app.get("/hello", (req, res, next) => {
  console.log(req.query);
  if (req.query.error) {
    next({ code: 3333, msg: "테스트" });
  } else {
    console.log("", req.nowTime);
    res.send(req.nowTime); // res가 있는 것들은 라우터라고 함!
  }
});

// 이제부터 미들웨어를 만들어 보려고함~

app.use((req, res, next) => {
  console.log("Error Router");
  // 라우터 안의 콜백에는 인자가 최대 4개까지 가능함
  const msg =
    '<h1 style="margin: 100px; color: red;">Error 404</h1>' + nowTime();
  next({ code: 404, msg }); // next()에 인자가 생기면 에러러 간주함
  // next(createError(404, { msg, code: 404 }));
});

// 인자가 4개로 생각됨
app.use((err, req, res, next) => {
  // 에러를 받아주는 라우터가 있다면 모든 라우터는 next라는 인자를 받을 수 있다.
  // console.log(err.code, res.code, next.code, tets.code);
  // res.json(`${err.code}</br>${error.msg}`);

  console.log("Error Sender");
  console.log(err.code);
  res.send(err);
});
