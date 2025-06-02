export default function App() {
  return (
    <div className="min-h-dvh grid place-items-center" style={{ backgroundImage: "linear-gradient(220.55deg, #565656 0%, #181818 100%)" }}>
      <div className="w-md p-8 rounded-xl bg-white/70 backdrop-blur-md grid justify-items-center gap-2">
        <img className="w-40 rounded-full" src="profile.jpg" alt="プロフィール画像" />
        <p className="text-2xl font-bold">Rafael ヤスヒデ 須藤</p>
        <p className="text-lg text-gray-700">駆け出しエンジニア見習い</p>
        <div className="text-gray-800 flex flex-col items-center py-6">
          <p>日本生まれ日本育ちの日系ブラジル人です。</p>
          <p>フロントエンドが好きです。</p>
        </div>
      </div>
    </div>
  )
}