/* ===== Grupo Arvor — hoja de estilos compartida (blog / contacto / gracias) ===== */
:root{
  --night:#08131e;--night-2:#0c1b29;--panel:#0f2230;--ink:#0a1722;
  --cloud:#f3f1ea;--mist:#9fb4c2;--mist-2:#c5d3dd;
  --orange:#f26a1b;--ember:#ff8a3d;--teal:#15a9c9;--blue:#1f6fb8;
  --line:rgba(159,180,194,.16);--maxw:1180px;--r:18px;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--night);color:var(--cloud);font-family:"Inter",system-ui,sans-serif;font-size:17px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
h1,h2,h3,h4{font-family:"Sora",sans-serif;margin:0;line-height:1.12;letter-spacing:-.02em}
a{color:inherit;text-decoration:none}
p{margin:0}
img{max-width:100%;display:block}
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 28px}
.eyebrow{font-family:"Sora",sans-serif;font-size:12px;font-weight:600;letter-spacing:.34em;text-transform:uppercase;color:var(--ember);display:inline-flex;align-items:center;gap:12px}
.eyebrow::before{content:"";width:34px;height:1px;background:linear-gradient(90deg,var(--orange),transparent)}
.grad{background:linear-gradient(96deg,var(--teal),var(--blue) 45%,var(--ember));-webkit-background-clip:text;background-clip:text;color:transparent}

/* progress bar */
#progress{position:fixed;top:0;left:0;height:3px;width:0;z-index:200;background:linear-gradient(90deg,var(--teal),var(--blue),var(--orange));box-shadow:0 0 14px rgba(242,106,27,.55);transition:width .12s linear}

/* nav */
nav{position:fixed;top:0;left:0;right:0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:18px 28px;transition:background .4s,border-color .4s,padding .4s;border-bottom:1px solid transparent}
nav.scrolled{background:rgba(8,19,30,.82);backdrop-filter:blur(14px);border-bottom:1px solid var(--line);padding:14px 28px}
.logo-link{display:inline-flex;align-items:center}
.logo-mark{display:block;height:28px;width:auto;transition:height .4s}
nav.scrolled .logo-mark{height:24px}
.nav-links{display:flex;gap:28px;align-items:center}
.nav-links a{font-size:14px;color:var(--mist-2);font-weight:500;transition:color .2s;position:relative}
.nav-links a:hover{color:var(--cloud)}
.nav-links a:not(.nav-cta)::after{content:"";position:absolute;left:0;right:100%;bottom:-5px;height:2px;background:linear-gradient(90deg,var(--teal),var(--orange));transition:right .35s;border-radius:2px}
.nav-links a:not(.nav-cta).active::after{right:0}
.nav-cta{border:1px solid var(--line);border-radius:999px;padding:9px 18px;font-size:13px;font-weight:600;color:var(--cloud);transition:.25s}
.nav-cta:hover{border-color:var(--orange);background:rgba(242,106,27,.1)}
@media(max-width:860px){.nav-links a:not(.nav-cta){display:none}}

/* buttons */
.btn{font-family:"Sora",sans-serif;font-weight:600;font-size:15px;padding:15px 28px;border-radius:999px;transition:.25s;cursor:pointer;border:none;display:inline-flex;align-items:center;gap:10px;position:relative;overflow:hidden}
.btn-primary{background:linear-gradient(95deg,var(--orange),var(--ember));color:#1a0c02;box-shadow:0 12px 36px -12px rgba(242,106,27,.7)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 18px 44px -12px rgba(242,106,27,.85)}
.btn-ghost{background:rgba(255,255,255,.04);border:1px solid var(--line);color:var(--cloud)}
.btn-ghost:hover{border-color:var(--mist);background:rgba(255,255,255,.08)}
.btn::after{content:"";position:absolute;top:0;left:-130%;width:65%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.38),transparent);transform:skewX(-18deg);transition:left .6s;pointer-events:none}
.btn:hover::after{left:150%}

/* aurora background block */
.aurora-bg{position:relative;overflow:hidden}
.aurora-bg .aurora{position:absolute;inset:-30% -10%;z-index:0;filter:blur(80px);opacity:.7;pointer-events:none}
.aurora-bg .aurora span{position:absolute;border-radius:50%;mix-blend-mode:screen}
.aurora-bg .a1{width:55vw;height:55vw;left:-10%;top:-25%;background:radial-gradient(circle,var(--teal),transparent 62%);animation:drift1 24s ease-in-out infinite}
.aurora-bg .a2{width:50vw;height:50vw;right:-12%;top:-15%;background:radial-gradient(circle,var(--orange),transparent 60%);animation:drift2 28s ease-in-out infinite}
.aurora-bg .a3{width:45vw;height:45vw;left:25%;bottom:-30%;background:radial-gradient(circle,var(--blue),transparent 62%);animation:drift3 32s ease-in-out infinite}
@keyframes drift1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(8%,6%) scale(1.12)}}
@keyframes drift2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-7%,9%) scale(1.08)}}
@keyframes drift3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(5%,-7%) scale(1.15)}}

/* reveal */
.reveal{opacity:0;transform:translateY(30px) scale(.985);filter:blur(6px);transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1),filter .8s}
.reveal.in{opacity:1;transform:none;filter:none}
.reveal[data-d="1"]{transition-delay:.08s}.reveal[data-d="2"]{transition-delay:.16s}.reveal[data-d="3"]{transition-delay:.24s}.reveal[data-d="4"]{transition-delay:.32s}.reveal[data-d="5"]{transition-delay:.4s}.reveal[data-d="6"]{transition-delay:.48s}

/* page hero */
.page-hero{position:relative;padding:150px 0 60px;background:linear-gradient(180deg,var(--night),var(--night-2))}
.page-hero::after{content:"";position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 0%,transparent 45%,var(--night) 95%);pointer-events:none}
.page-hero .wrap{position:relative;z-index:2}
.page-hero h1{font-size:clamp(2.4rem,6vw,4rem);font-weight:800;margin:18px 0 0}
.page-hero .sub{color:var(--mist);max-width:60ch;margin-top:20px;font-size:1.1rem}

/* ===== BLOG ===== */
.cat-filter{display:flex;flex-wrap:wrap;gap:10px;margin:34px 0 0}
.cat{font-family:"Sora",sans-serif;font-size:13px;font-weight:600;letter-spacing:.02em;color:var(--mist-2);padding:8px 16px;border:1px solid var(--line);border-radius:999px;background:rgba(255,255,255,.02);cursor:pointer;transition:.25s}
.cat:hover{color:var(--cloud);border-color:var(--mist)}
.cat.active{background:linear-gradient(95deg,var(--orange),var(--ember));color:#1a0c02;border-color:transparent}

.featured{display:grid;grid-template-columns:1.15fr .85fr;gap:0;margin:56px 0 0;border:1px solid var(--line);border-radius:var(--r);overflow:hidden;background:linear-gradient(150deg,#0a1f2e,#0c2433);transition:transform .3s,box-shadow .3s}
.featured:hover{transform:translateY(-4px);box-shadow:0 34px 66px -34px rgba(0,0,0,.8)}
@media(max-width:860px){.featured{grid-template-columns:1fr}}
.featured .cover{min-height:280px;background-size:cover;background-position:center;position:relative}
.featured .cover::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg,rgba(8,19,30,.15),rgba(8,19,30,.55))}
.featured .body{padding:40px 38px;display:flex;flex-direction:column;justify-content:center}
.featured .tagcat{align-self:flex-start;font-family:"Sora",sans-serif;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--ember)}
.featured h2{font-size:clamp(1.5rem,3vw,2.1rem);font-weight:800;margin:16px 0 0}
.featured p{color:var(--mist-2);margin-top:14px}
.featured .meta{color:var(--mist);font-size:.86rem;margin-top:18px}

.post-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:26px}
@media(max-width:900px){.post-grid{grid-template-columns:1fr 1fr}}
@media(max-width:600px){.post-grid{grid-template-columns:1fr}}
.post-card{display:flex;flex-direction:column;border:1px solid var(--line);border-radius:var(--r);overflow:hidden;background:linear-gradient(180deg,var(--panel),var(--night-2));transition:transform .3s,box-shadow .3s,border-color .3s;will-change:transform}
.post-card:hover{transform:translateY(-6px);box-shadow:0 30px 60px -32px rgba(0,0,0,.75)}
.post-card .cover{height:170px;background-size:cover;background-position:center;position:relative}
.post-card .cover::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent,rgba(8,19,30,.35))}
.post-card .pc-body{padding:22px 22px 24px;display:flex;flex-direction:column;flex:1}
.post-card .tagcat{font-family:"Sora",sans-serif;font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--teal)}
.post-card h3{font-size:1.2rem;font-weight:700;margin:12px 0 0;letter-spacing:-.01em}
.post-card p{color:var(--mist);font-size:.94rem;margin-top:10px;flex:1}
.post-card .meta{color:var(--mist);font-size:.82rem;margin-top:16px;display:flex;gap:10px;align-items:center}
.post-card .arrow{margin-top:14px;font-family:"Sora",sans-serif;font-size:13px;font-weight:600;color:var(--cloud);display:inline-flex;align-items:center;gap:7px;transition:gap .25s,color .25s}
.post-card:hover .arrow{color:var(--teal);gap:11px}

/* ===== ARTICLE ===== */
.article-hero{position:relative;padding:150px 0 40px}
.article-hero .cover{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.28}
.article-hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,19,30,.7),var(--night))}
.article-hero .wrap{position:relative;z-index:2;max-width:820px}
.article-hero .tagcat{font-family:"Sora",sans-serif;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--ember)}
.article-hero h1{font-size:clamp(2rem,4.6vw,3.2rem);font-weight:800;margin:16px 0 0;max-width:20ch}
.article-hero .meta{color:var(--mist);font-size:.9rem;margin-top:22px;display:flex;gap:14px;flex-wrap:wrap;align-items:center}
.article-hero .meta .dot{width:4px;height:4px;border-radius:50%;background:var(--mist)}
.article{max-width:720px;margin:0 auto;padding:20px 28px 90px}
.article p{color:var(--mist-2);margin:20px 0;font-size:1.09rem;line-height:1.75}
.article h2{font-size:1.6rem;font-weight:700;margin:44px 0 6px;color:var(--cloud)}
.article h3{font-size:1.2rem;font-weight:700;margin:30px 0 4px;color:var(--cloud)}
.article ul,.article ol{color:var(--mist-2);margin:18px 0;padding-left:22px}
.article li{margin:9px 0}
.article strong{color:var(--cloud)}
.article blockquote{margin:28px 0;padding:16px 22px;border-left:3px solid var(--orange);background:rgba(242,106,27,.06);border-radius:0 8px 8px 0;color:var(--mist-2);font-style:italic}
.article .lead{font-size:1.25rem;color:var(--cloud);line-height:1.6}
.back{display:inline-flex;align-items:center;gap:8px;color:var(--mist-2);font-family:"Sora",sans-serif;font-size:14px;font-weight:600;margin-bottom:6px}
.back:hover{color:var(--cloud)}
.article-cta{max-width:720px;margin:0 auto 90px;padding:34px 34px;border:1px solid var(--line);border-radius:var(--r);background:linear-gradient(120deg,rgba(21,169,201,.12),rgba(242,106,27,.12));text-align:center}
.article-cta h3{font-size:1.4rem;font-weight:800}
.article-cta p{color:var(--mist-2);margin:10px 0 20px}

/* ===== FORM ===== */
.form-section{padding:60px 0 100px}
.form-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:52px;align-items:start}
@media(max-width:860px){.form-grid{grid-template-columns:1fr;gap:32px}}
.form-aside h2{font-size:clamp(1.6rem,3.4vw,2.3rem);font-weight:800}
.form-aside p{color:var(--mist-2);margin-top:16px}
.form-aside .info{margin-top:26px;display:flex;flex-direction:column;gap:14px}
.form-aside .info div{display:flex;gap:12px;align-items:flex-start;color:var(--mist-2);font-size:.96rem}
.form-aside .info .ic{color:var(--teal);flex:none;margin-top:2px}
.form-card{background:linear-gradient(180deg,var(--panel),var(--night-2));border:1px solid var(--line);border-radius:var(--r);padding:34px 32px}
.field{margin-bottom:18px}
.field label{display:block;font-family:"Sora",sans-serif;font-size:12.5px;font-weight:600;letter-spacing:.04em;color:var(--mist-2);margin-bottom:8px}
.field label .req{color:var(--orange)}
.field input,.field select,.field textarea{width:100%;background:rgba(8,19,30,.55);border:1px solid var(--line);border-radius:12px;padding:13px 15px;color:var(--cloud);font-family:"Inter",sans-serif;font-size:15px;transition:border-color .2s,box-shadow .2s}
.field textarea{min-height:120px;resize:vertical}
.field input:focus,.field select:focus,.field textarea:focus{outline:none;border-color:var(--teal);box-shadow:0 0 0 3px rgba(21,169,201,.18)}
.field select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' stroke='%239fb4c2' stroke-width='2'%3E%3Cpath d='M1 1l5 5 5-5'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 15px center}
.field.two{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:520px){.field.two{grid-template-columns:1fr}}
.field .err{color:#ff9a7a;font-size:12.5px;margin-top:6px;display:none}
.field.invalid input,.field.invalid textarea,.field.invalid select{border-color:#e2593b}
.field.invalid .err{display:block}
.form-card .submit{width:100%;justify-content:center;margin-top:6px}
.form-card .submit[disabled]{opacity:.6;cursor:not-allowed}
.consent{display:flex;gap:10px;align-items:flex-start;color:var(--mist);font-size:12.5px;margin:4px 0 18px}
.consent input{width:16px;height:16px;margin-top:2px;flex:none;accent-color:var(--orange)}
.form-note{color:var(--mist);font-size:12px;text-align:center;margin-top:16px}

/* ===== THANK YOU ===== */
.ty{min-height:88vh;display:flex;align-items:center;text-align:center;position:relative}
.ty .wrap{position:relative;z-index:2;max-width:640px}
.ty .check{width:84px;height:84px;margin:0 auto 26px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(120deg,var(--teal),var(--blue));box-shadow:0 20px 50px -18px rgba(21,169,201,.6);animation:pop .6s cubic-bezier(.2,.9,.3,1.5) both}
@keyframes pop{0%{transform:scale(.4);opacity:0}100%{transform:scale(1);opacity:1}}
.ty h1{font-size:clamp(2rem,5vw,3.2rem);font-weight:800}
.ty p{color:var(--mist-2);margin:20px 0 0;font-size:1.1rem}
.ty .actions{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:34px}

/* footer */
footer{border-top:1px solid var(--line);padding:46px 0 60px;background:var(--ink)}
.foot-grid{display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap}
.foot-links{display:flex;gap:20px;flex-wrap:wrap}
.foot-links a{font-size:14px;color:var(--mist);transition:color .2s}
.foot-links a:hover{color:var(--cloud)}
.foot-base{margin-top:26px;font-size:13px;color:var(--mist);border-top:1px solid var(--line);padding-top:22px}

:focus-visible{outline:2px solid var(--ember);outline-offset:3px;border-radius:4px}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}

@media(prefers-reduced-motion:reduce){
  *{animation:none!important;transition:none!important}
  .reveal{opacity:1;transform:none;filter:none}
}
