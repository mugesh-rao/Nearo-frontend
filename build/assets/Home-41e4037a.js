import {
  r as s,
  _ as l,
  a as r,
  b as c,
  j as e,
  L as i,
} from "./index-70997a97.js";
const n = "/assets/Nearo-home-43d6c335.mp4",
  m = s.lazy(() =>
    l(
      () => import("./Features-1d7fb616.js"),
      [
        "assets/Features-1d7fb616.js",
        "assets/index-70997a97.js",
        "assets/index-52a015f8.css",
        "assets/CircularProgress-73940f8d.js",
      ]
    )
  ),
  x = s.lazy(() =>
    l(
      () => import("./Work-986e388f.js"),
      [
        "assets/Work-986e388f.js",
        "assets/index-70997a97.js",
        "assets/index-52a015f8.css",
        "assets/CircularProgress-73940f8d.js",
      ]
    )
  ),
  u = s.lazy(() =>
    l(
      () => import("./Footer-e404992d.js"),
      [
        "assets/Footer-e404992d.js",
        "assets/index-70997a97.js",
        "assets/index-52a015f8.css",
        "assets/index.esm-34bd9e10.js",
      ]
    )
  ),
  f = () => {
    const t = r(),
      o = c(),
      a = () => {
        o("/signup/personaldetails"),
          t({ type: "falser" }),
          t({ type: "falselog" });
      };
    return (
      s.useEffect(() => {
        t({ type: "truer" }),
          t({ type: "truelog" }),
          t({ type: "trueDash" }),
          (document.body.style.overflowY = "scroll");
      }),
      e.jsx(e.Fragment, {
        children: e.jsxs("div", {
          className: " 2xl:w-[80%] mx-auto ",
          children: [
            e.jsxs("div", {
              className:
                "home mt-4 text-center lg:text-left flex flex-col lg:flex-row p-2 sm:px-12 justify-between  ",
              children: [
                e.jsxs("div", {
                  className: " flex flex-col justify-center lg:w-[50%]",
                  id: "home",
                  children: [
                    e.jsxs("h1", {
                      className:
                        "text-5xl font-bold sm:text-[5rem] lg:font-bold ",
                      children: [
                        "Become a ",
                        e.jsx("br", {}),
                        e.jsx("span", {
                          className: "text-[#1687a7]",
                          children: "Seller!",
                        }),
                        " ",
                      ],
                    }),
                    e.jsx("p", {
                      className:
                        "my-5 text-[#757575] lg:text-lg font-extralight ",
                      children:
                        "Looking to expand your bussiness beyond your local cummunity and tap into a wider customer base ? Join Our e-commerce platform as a seller So why wait? Sign up today",
                    }),
                    e.jsxs("div", {
                      className:
                        "w-full flex items-center justify-center  lg:justify-normal flex-col custom300:flex-row  ",
                      children: [
                        e.jsx("button", {
                          onClick: a,
                          className: "btn1 w-full custom300:w-fit ",
                          children: "Start Selling",
                        }),
                        e.jsx("button", {
                          className:
                            "btn2 my-4 w-full custom300:w-fit custom300:ml-2  custom400:mx-5",
                          children: "Take a tour",
                        }),
                      ],
                    }),
                  ],
                }),
                e.jsx("div", {
                  className: "home-box sm:ml-4 ",
                  children: e.jsx("video", {
                    width: "640",
                    height: "360",
                    autoPlay: !0,
                    loop: !0,
                    controls: !1,
                    children: e.jsx("source", { src: n, type: "video/mp4" }),
                  }),
                }),
              ],
            }),
            e.jsxs(s.Suspense, {
              fallback: e.jsx("div", {
                className:
                  "h-screen w-full grid place-items-center fixed z-20 top-0 right-0 bottom-0 left-0 bg-white",
                children: e.jsx(i, {}),
              }),
              children: [e.jsx(m, {}), e.jsx(x, {}), e.jsx(u, {})],
            }),
          ],
        }),
      })
    );
  };
export { f as default };
