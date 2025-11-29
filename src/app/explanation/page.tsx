"use client";

import Navigation from "@/components/Navigation";
import R from "@/components/Ruby";

export default function ExplanationPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">
        <R rt="おと">音</R>のしくみ
      </h1>

      <div className="mb-6">
        <video
          controls
          loop
          autoPlay
          playsInline
          className="w-full rounded-lg"
          src="/video/explanation.mp4"
        >
          お<R rt="つか">使</R>いのブラウザは<R rt="どうが">動画</R><R rt="さいせい">再生</R>に<R rt="たいおう">対応</R>していません
        </video>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg text-gray-800">
        <h2 className="text-xl font-bold mb-4">
          フーリエ<R rt="へんかん">変換</R>ってなに？
        </h2>

        <div className="space-y-4 text-lg">
          <p>
            <R rt="おと">音</R>は「<R rt="なみ">波</R>」でできているんだ。
            <R rt="たか">高</R>い<R rt="おと">音</R>、<R rt="ひく">低</R>い<R rt="おと">音</R>、いろんな<R rt="なみ">波</R>が<R rt='ま'>混</R>ざっているよ。
          </p>

          <p>
            <strong>フーリエ<R rt="へんかん">変換</R></strong>は、
            <R rt='ま'>混</R>ざった<R rt="なみ">波</R>をバラバラにする<R rt="けいさん">計算</R><R rt="ほうほう">方法</R>だよ！
          </p>

          <div className="bg-white p-4 rounded-lg">
            <p className="font-bold mb-2">たとえば...</p>
            <p>
              ピアノの<R rt="おと">音</R>は、いくつもの<R rt="たか">高</R>さの<R rt="おと">音</R>が<R rt="かさ">重</R>なっているんだ。
              フーリエ<R rt="へんかん">変換</R>を<R rt="つか">使</R>うと、どんな<R rt="たか">高</R>さの<R rt="おと">音</R>が
              <R rt='ま'>混</R>ざっているかわかるよ。
            </p>
          </div>

          <p>
            さっきやった「<R rt="ひく">低</R>い<R rt="おと">音</R>を<R rt="け">消</R>す」や「<R rt="たか">高</R>い<R rt="おと">音</R>を<R rt="け">消</R>す」は……
          </p>
          <img src="/image/FFT.png" alt="フーリエ変換の説明図" className="my-4 rounded-lg" />
          <p>
            フーリエ<R rt="へんかん">変換</R>で<R rt="おと">音</R>を<R rt="わ">分</R>けてから……
          </p>
          <img src="/image/filtering.png" alt="フィルターの説明図" className="my-4 rounded-lg" />
          <p>
            いらない<R rt="ぶぶん">部分</R>を<R rt="け">消</R>しているんだ！
          </p>

        </div>
      </div>

      <Navigation
        prevHref="/process"
        prevLabel={<><R rt="かこう">加工</R>へ</>}
        nextHref="/summary"
        nextLabel="まとめへ"
      />
    </div>
  );
}
