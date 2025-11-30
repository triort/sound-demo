import Link from "next/link";
import Navigation from "@/components/Navigation";
import R from "@/components/Ruby";

export default function SummaryPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">まとめ</h1>

      <div className="bg-green-50 p-6 rounded-lg mb-8 text-gray-800">
        <h2 className="text-xl font-bold mb-4">
          <R rt="きょう">今日</R><R rt="まな">学</R>んだこと
        </h2>

        <div className="space-y-4 text-lg">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-bold text-blue-600 mb-2">
              1. <R rt="おと">音</R>は<R rt="なみ">波</R>
            </p>
            <p>
              <R rt="おと">音</R>は<R rt="くうき">空気</R>のふるえ（<R rt="なみ">波</R>）でできているよ。
              <R rt="たか">高</R>い<R rt="おと">音</R>は<R rt="なみ">波</R>が<R rt="こま">細</R>かく、<R rt="ひく">低</R>い<R rt="おと">音</R>は<R rt="なみ">波</R>が<R rt="おお">大</R>きいんだ。
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <p className="font-bold text-blue-600 mb-2">
              2. <R rt="こえ">声</R>はいろんな<R rt="なみ">波</R>の<R rt="あつ">集</R>まり
            </p>
            <p>
              <R rt="ひと">人</R>の<R rt="こえ">声</R>には、<R rt="たか">高</R>い<R rt="なみ">波</R>も<R rt="ひく">低</R>い<R rt="なみ">波</R>もまざっているよ。

            </p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <p className="font-bold text-blue-600 mb-2">
              3. <R rt="なみ">波</R>を<R rt="か">変</R>えると<R rt="おと">音</R>が<R rt="か">変</R>わる
            </p>
            <p>
              コンピュータを<R rt="つか">使</R>うと<R rt="なみ">波</R>を<R rt="か">変</R>えられるよ。バラバラになった<R rt="なみ">波</R>から
              <R rt="たか">高</R>い<R rt="なみ">波</R>を<R rt="け">消</R>したり、<R rt="なみ">波</R>を<R rt="の">伸</R>ばしたり<R rt="ちぢ">縮</R>めたりできるんだ。
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <p className="font-bold text-blue-600 mb-2">
              4. フーリエ<R rt="へんかん">変換</R>
            </p>
            <p>
              まざった<R rt="なみ">波</R>をバラバラに<R rt="わ">分</R>ける<R rt="ほうほう">方法</R>だよ。
              <R rt="おと">音</R>を使ったモノのほとんどに<R rt="つか">使</R>われている<R rt="けいさんほうほう">計算方法</R>だよ！
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <p className="text-xl mb-4">
          <R rt="たいけん">体験</R>おつかれさまでした！
        </p>
        <p className="text-lg text-gray-600">
          <R rt="おと">音</R>の<R rt="ふしぎ">不思議</R>、<R rt="たの">楽</R>しかったかな？
        </p>
      </div>

      <div className="flex justify-center">
        <Link
          href="/"
          className="px-8 py-4 bg-blue-500 text-white text-xl rounded-lg"
        >
          トップページへ<R rt="もど">戻</R>る
        </Link>
      </div>

      <Navigation prevHref="/explanation" prevLabel={<><R rt="せつめい">説明</R>へ</>} />
    </div>
  );
}
