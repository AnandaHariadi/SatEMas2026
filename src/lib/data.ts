// Core data structures and datasets for SATRISNA Decision Support System

export interface MonthlyPriceRecord {
  month: string; // "YYYY-MM"
  price: number; // IDR per Kg
}

export interface CommodityData {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  unit: string;
  historical: MonthlyPriceRecord[];
  volatilityRating: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface NewsItem {
  slug: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  tag: 'Fiskal' | 'Global' | 'Pangan' | 'Bulog';
  author: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'Ekonometrika' | 'Kebijakan Fiskal' | 'Makroekonomi';
}

export type QuestionType = 'pilihan-ganda' | 'true-false' | 'simulasi' | 'match';

export interface QuizQuestion {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswerIndex?: number;
  trueValue?: boolean;
  simulationInput?: number; // e.g. 10 for "10%" rice price hike
  simulationCorrectResultRange?: [number, number]; // [min, max] expected inflation change
  matches?: { left: string; right: string }[]; // for match questions
  explanation: string;
  illustrationType?: 'beras' | 'cabai' | 'daging' | 'minyak';
}

export const COMMODITIES: CommodityData[] = [
  {
    id: 'beras',
    name: 'Beras Premium',
    category: 'Karbohidrat',
    currentPrice: 15400,
    unit: 'Kg',
    volatilityRating: 'Low',
    description: 'Bahan pangan pokok utama Indonesia. Sangat sensitif terhadap subsidi pupuk, El Nino, dan kuota impor.',
    historical: [
      { month: '2023-01', price: 12500 }, { month: '2023-02', price: 12600 }, { month: '2023-03', price: 12400 },
      { month: '2023-04', price: 12550 }, { month: '2023-05', price: 12700 }, { month: '2023-06', price: 12850 },
      { month: '2023-07', price: 13000 }, { month: '2023-08', price: 13200 }, { month: '2023-09', price: 13600 },
      { month: '2023-10', price: 13900 }, { month: '2023-11', price: 14100 }, { month: '2023-12', price: 14200 },
      { month: '2024-01', price: 14400 }, { month: '2024-02', price: 15100 }, { month: '2024-03', price: 15500 },
      { month: '2024-04', price: 15200 }, { month: '2024-05', price: 14900 }, { month: '2024-06', price: 14800 },
      { month: '2024-07', price: 14850 }, { month: '2024-08', price: 14900 }, { month: '2024-09', price: 15000 },
      { month: '2024-10', price: 15150 }, { month: '2024-11', price: 15250 }, { month: '2024-12', price: 15300 },
      { month: '2025-01', price: 15450 }, { month: '2025-02', price: 15600 }, { month: '2025-03', price: 15800 },
      { month: '2025-04', price: 15550 }, { month: '2025-05', price: 15350 }, { month: '2025-06', price: 15200 },
      { month: '2025-07', price: 15250 }, { month: '2025-08', price: 15300 }, { month: '2025-09', price: 15380 },
      { month: '2025-10', price: 15450 }, { month: '2025-11', price: 15400 }, { month: '2025-12', price: 15400 }
    ]
  },
  {
    id: 'cabai',
    name: 'Cabai Rawit Merah',
    category: 'Hortikultura',
    currentPrice: 62000,
    unit: 'Kg',
    volatilityRating: 'High',
    description: 'Komoditas volatile food dengan fluktuasi harga ekstrem akibat cuaca buruk dan biaya logistik distribusi.',
    historical: [
      { month: '2023-01', price: 58000 }, { month: '2023-02', price: 62000 }, { month: '2023-03', price: 48000 },
      { month: '2023-04', price: 42000 }, { month: '2023-05', price: 38000 }, { month: '2023-06', price: 45000 },
      { month: '2023-07', price: 52000 }, { month: '2023-08', price: 55000 }, { month: '2023-09', price: 68000 },
      { month: '2023-10', price: 78000 }, { month: '2023-11', price: 89000 }, { month: '2023-12', price: 95000 },
      { month: '2024-01', price: 82000 }, { month: '2024-02', price: 74000 }, { month: '2024-03', price: 61000 },
      { month: '2024-04', price: 48000 }, { month: '2024-05', price: 45000 }, { month: '2024-06', price: 42000 },
      { month: '2024-07', price: 58000 }, { month: '2024-08', price: 69000 }, { month: '2024-09', price: 63000 },
      { month: '2024-10', price: 52000 }, { month: '2024-11', price: 59000 }, { month: '2024-12', price: 74000 },
      { month: '2025-01', price: 81000 }, { month: '2025-02', price: 72000 }, { month: '2025-03', price: 63000 },
      { month: '2025-04', price: 52000 }, { month: '2025-05', price: 46000 }, { month: '2025-06', price: 49000 },
      { month: '2025-07', price: 54000 }, { month: '2025-08', price: 58000 }, { month: '2025-09', price: 61000 },
      { month: '2025-10', price: 65000 }, { month: '2025-11', price: 63500 }, { month: '2025-12', price: 62000 }
    ]
  },
  {
    id: 'bawang',
    name: 'Bawang Merah',
    category: 'Hortikultura',
    currentPrice: 38500,
    unit: 'Kg',
    volatilityRating: 'Medium',
    description: 'Komoditas bumbu dapur utama. Rentan terhadap siklus panen lokal dan kondisi penyimpanan pascapanen.',
    historical: [
      { month: '2023-01', price: 34000 }, { month: '2023-02', price: 36000 }, { month: '2023-03', price: 37500 },
      { month: '2023-04', price: 35000 }, { month: '2023-05', price: 33000 }, { month: '2023-06', price: 31000 },
      { month: '2023-07', price: 30000 }, { month: '2023-08', price: 32000 }, { month: '2023-09', price: 34000 },
      { month: '2023-10', price: 36500 }, { month: '2023-11', price: 39000 }, { month: '2023-12', price: 42000 },
      { month: '2024-01', price: 41000 }, { month: '2024-02', price: 39500 }, { month: '2024-03', price: 38000 },
      { month: '2024-04', price: 43000 }, { month: '2024-05', price: 48000 }, { month: '2024-06', price: 44000 },
      { month: '2024-07', price: 39000 }, { month: '2024-08', price: 35000 }, { month: '2024-09', price: 33000 },
      { month: '2024-10', price: 34500 }, { month: '2024-11', price: 36000 }, { month: '2024-12', price: 39000 },
      { month: '2025-01', price: 41500 }, { month: '2025-02', price: 42000 }, { month: '2025-03', price: 39000 },
      { month: '2025-04', price: 37000 }, { month: '2025-05', price: 35000 }, { month: '2025-06', price: 34500 },
      { month: '2025-07', price: 35500 }, { month: '2025-08', price: 36800 }, { month: '2025-09', price: 37400 },
      { month: '2025-10', price: 38100 }, { month: '2025-11', price: 39200 }, { month: '2025-12', price: 38500 }
    ]
  }
];

export const NEWS_DATA: NewsItem[] = [
  {
    slug: 'volatilitas-energi-global-dan-inflasi',
    title: 'Volatilitas Harga Minyak Bumi Global Picu Lonjakan Biaya Logistik Pangan Domestik',
    summary: 'Ketegangan geopolitik Timur Tengah mendorong naiknya harga minyak mentah Brent, memicu kekhawatiran kenaikan tarif angkut pangan antar pulau.',
    content: `
      <p class="mb-4">Gejolak geopolitik global yang belum mereda kembali membayangi ketahanan pangan nasional. Kenaikan harga minyak mentah jenis Brent melewati angka USD 85 per barel secara langsung memicu kenaikan ongkos solar logistik di berbagai daerah transit utama.</p>
      <p class="mb-4">Berdasarkan pemodelan ekonometrika SATRISNA, setiap kenaikan 10% pada harga minyak global berkorelasi dengan kenaikan 1,4% pada komponen volatile food (inflasi bergejolak) dalam waktu 3 bulan ke depan melalui transmisi biaya distribusi.</p>
      <blockquote class="border-l-4 border-emerald-500 pl-4 italic my-4 text-slate-300">
        "Distribusi pangan antar-pulau di Indonesia sangat bergantung pada moda transportasi laut dan darat berbahan bakar fosil. Ketika harga bahan bakar meningkat, penyesuaian harga di tingkat pasar eceran sulit dihindari," ujar peneliti makroekonomi SATRISNA.
      </blockquote>
      <p class="mb-4">Menanggapi hal ini, pemerintah disarankan untuk mengoptimalkan cadangan pangan daerah dan memperkuat program kerja sama antardaerah (KAD) untuk menekan margin distribusi logistik.</p>
    `,
    date: '2026-07-20',
    tag: 'Global',
    author: 'Dr. Lana Fathia, M.Econ'
  },
  {
    slug: 'kebijakan-subsidi-pupuk-2026',
    title: 'Analisis Fiskal: Kenaikan Anggaran Subsidi Pupuk Efektif Redam Harga Beras Premium',
    summary: 'Langkah pemerintah menaikkan alokasi pupuk bersubsidi sebesar 40% dinilai sukses menjaga produktivitas petani dan menstabilkan inflasi beras.',
    content: `
      <p class="mb-4">Keputusan Kementerian Keuangan untuk merealokasi anggaran fiskal belanja barang guna menambah kuota pupuk bersubsidi mulai membuahkan hasil. Indeks harga beras nasional pada kuartal II 2026 mencatat penurunan tipis sebesar 0,85% month-on-month.</p>
      <p class="mb-4">Kebijakan ini menjadi instrumen fiskal krusial di tengah ancaman el-nino lemah yang melanda sebagian wilayah lumbung padi Jawa Barat dan Jawa Tengah. Dengan pasokan pupuk yang terjaga, biaya pokok produksi di tingkat petani dapat ditekan.</p>
      <blockquote class="border-l-4 border-emerald-500 pl-4 italic my-4 text-slate-300">
        "Simulasi kebijakan fiskal SATRISNA menunjukkan bahwa subsidi pupuk yang merata mampu memotong biaya produksi hingga 12%, menurunkan harga eceran beras di pasar tradisional secara signifikan tanpa membebani neraca perdagangan pangan."
      </blockquote>
      <p class="mb-4">Namun, tantangan berikutnya berada pada tata kelola distribusi kartu tani agar subsidi ini tepat saran dan meminimalisir kebocoran ke sektor perkebunan industri.</p>
    `,
    date: '2026-07-15',
    tag: 'Fiskal',
    author: 'Prof. Bambang Prasetyo'
  }
];

export const GLOSSARY_DATA: GlossaryTerm[] = [
  {
    term: 'ARIMA (AutoRegressive Integrated Moving Average)',
    definition: 'Model analisis statistik time-series yang menggunakan data historis masa lalu dan error residual untuk memproyeksikan nilai komoditas di masa mendatang.',
    category: 'Ekonometrika'
  },
  {
    term: 'GARCH (Generalized Autoregressive Conditional Heteroskedasticity)',
    definition: 'Model ekonometrika yang digunakan untuk menganalisis dan memprediksi volatilitas atau risiko ketidakpastian harga dari waktu ke waktu, sangat cocok untuk komoditas hortikultura yang sangat berfluktuasi seperti cabai.',
    category: 'Ekonometrika'
  },
  {
    term: 'Kebijakan Fiskal Pangan',
    definition: 'Langkah intervensi pemerintah menggunakan APBN/APBD melalui mekanisme subsidi (input pertanian/pupuk), insentif pajak impor, serta belanja bantuan sosial pangan guna menjaga stabilitas harga.',
    category: 'Kebijakan Fiskal'
  },
  {
    term: 'Volatile Food Inflation',
    definition: 'Kelompok inflasi barang/jasa yang harganya sangat bergejolak, dominan dipengaruhi oleh shocks (kejutan) penawaran seperti faktor cuaca, panen, penyakit tanaman, dan rantai distribusi logistik.',
    category: 'Makroekonomi'
  }
];

// 4. Role-based Quiz Datasets
export const ROLE_QUIZZES: Record<string, QuizQuestion[]> = {
  mahasiswa: [
    {
      id: 101,
      type: 'pilihan-ganda',
      question: 'Di bawah model GARCH(1,1), parameter manakah yang mengukur persistensi atau memori volatilitas jangka panjang di pasar komoditas?',
      options: [
        'Parameter ARCH (Alpha: \u03b1) yang merepresentasikan dampak shock lag kuadrat.',
        'Parameter GARCH (Beta: \u03b2) yang menunjukkan persistensi varians kondisional lag.',
        'Koefisien Drift (mu) yang mewakili return rata-rata jangka panjang.',
        'Parameter Integration (d) yang mewakili stasioneritas time-series.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Dalam GARCH(1,1), Beta (\u03b2) mengukur persistensi dari conditional variance. Nilai \u03b2 yang tinggi mendekati 1.0 berarti volatilitas cenderung bertahan lama di pasar (volatility clustering).',
      illustrationType: 'cabai'
    },
    {
      id: 102,
      type: 'true-false',
      question: 'True atau False: Model ARIMA berasumsi bahwa varians residual (error) adalah konstan terhadap waktu (homoskedastisitas).',
      options: ['True (Benar)', 'False (Salah)'],
      correctAnswerIndex: 0,
      explanation: 'ARIMA mengasumsikan homoskedastisitas (varians residual konstan). Jika data menunjukkan heteroskedastisitas (varians error berubah-ubah), model GARCH ditambahkan untuk memodelkan varians tersebut.',
      illustrationType: 'beras'
    },
    {
      id: 103,
      type: 'simulasi',
      question: 'Uji simulasi transmisi: Geser estimasi peningkatan harga Beras Premium sebesar 10% untuk melihat dampaknya pada kenaikan inflasi pangan volatile food nasional (%), lalu submit!',
      simulationInput: 10,
      simulationCorrectResultRange: [3.5, 4.5], // expect ~4% food inflation hike
      explanation: 'Beras Premium menyumbang kontribusi bobot terbesar (~40%) dalam keranjang pengeluaran Volatile Food BPS. Peningkatan 10% pada beras mentransmisikan dampak sekitar 4.0% peningkatan langsung pada kelompok IHK makanan bergejolak.',
      illustrationType: 'beras'
    },
    {
      id: 104,
      type: 'match',
      question: 'Cocokkan instrumen kebijakan fiskal pangan (kiri) dengan dampak transmisi sektoral yang paling tepat (kanan):',
      matches: [
        { left: 'Subsidi Pupuk Pertanian', right: 'Menekan HPP (Harga Pokok Produksi) tani' },
        { left: 'Kuota Impor Beras CBP', right: 'Mengisi defisit pasok cadangan domestik' },
        { left: 'Operasi Pasar SPHP Bulog', right: 'Meredam ekspektasi spekulan eceran' }
      ],
      explanation: 'Subsidi pupuk memotong biaya input tani, impor beras menambal supply gap nasional, dan operasi pasar Bulog menyuntikkan pasokan instan ke retail untuk memangkas margin spekulatif pedagang.',
      illustrationType: 'minyak'
    }
  ],
  umkm: [
    {
      id: 201,
      type: 'pilihan-ganda',
      question: 'Jika model ekonometrika SATRISNA memproyeksikan harga Cabai Rawit akan memasuki fase volatilitas tinggi dalam 2 bulan ke depan, strategi pengamanan modal UMKM makanan yang paling tepat adalah:',
      options: [
        'Segera menutup usaha untuk menghindari kerugian pembelian bahan baku.',
        'Membeli cabai segar dalam jumlah sangat besar tanpa pengawetan (penimbunan).',
        'Melakukan kontrak harga pasokan tetap (hedging sederhana) dengan kelompok tani lokal atau beralih ke pasta cabai olahan berkualitas.',
        'Menyerap biaya kenaikan bahan baku sepenuhnya tanpa mengubah harga jual atau porsi piring.'
      ],
      correctAnswerIndex: 2,
      explanation: 'Kontrak harga tetap dengan produsen (kelompok tani) menjamin stabilitas biaya produksi UMKM di tengah badai volatilitas, melindungi margins tanpa menaikkan harga jual secara mendadak bagi konsumen.',
      illustrationType: 'cabai'
    },
    {
      id: 202,
      type: 'true-false',
      question: 'True atau False: Ketika harga beras premium naik, UMKM kuliner dapat memanfaatkan program SPHP Bulog di pasar tradisional untuk mendapatkan pasokan beras dengan Harga Eceran Tertinggi (HET) terkendali.',
      options: ['True (Benar)', 'False (Salah)'],
      correctAnswerIndex: 0,
      explanation: 'Beras program SPHP (Stabilisasi Pasokan dan Harga Pangan) disalurkan Perum Bulog langsung ke pasar-pasar tradisional untuk menjamin akses pangan murah dengan batas HET agar dapat dijangkau masyarakat dan UMKM.',
      illustrationType: 'beras'
    },
    {
      id: 203,
      type: 'simulasi',
      question: 'Uji simulasi UMKM: Geser tingkat kenaikan harga Cabai Rawit sebesar 20%. Berapa proyeksi dampak penyesuaian biaya operasional (%) warung makan berskala kecil?',
      simulationInput: 20,
      simulationCorrectResultRange: [5, 9], // expect ~7% cost hike
      explanation: 'Cabai rawit menyumbang sekitar 25-30% biaya bahan baku bumbu basah warung makan eceran. Kenaikan 20% harga cabai meningkatkan biaya operasional total sekitar 7.0%, memerlukan penyesuaian porsi atau diversifikasi bumbu.',
      illustrationType: 'cabai'
    }
  ],
  masyarakat: [
    {
      id: 301,
      type: 'pilihan-ganda',
      question: 'Mengapa ketika harga cabai rawit melonjak di pasar tradisional, angka inflasi makanan ikut terangkat naik secara cepat?',
      options: [
        'Karena cabai adalah bahan ekspor utama Indonesia ke luar negeri.',
        'Karena cabai dikonsumsi hampir setiap hari oleh mayoritas rumah tangga Indonesia, sehingga bobotnya dalam perhitungan inflasi IHK makanan cukup signifikan.',
        'Karena pemerintah mengenakan pajak barang mewah khusus untuk cabai rawit merah.',
        'Karena cabai rawit digunakan sebagai bahan baku utama pembangkit listrik nasional.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Masyarakat Indonesia sangat menyukai makanan pedas. Cabai rawit dikonsumsi harian oleh mayoritas rumah tangga, menjadikannya komoditas "volatile food" utama dengan bobot kontribusi inflasi yang besar bagi BPS.',
      illustrationType: 'cabai'
    },
    {
      id: 302,
      type: 'true-false',
      question: 'True atau False: Impor beras dilakukan pemerintah semata-mata untuk menguntungkan petani luar negeri dan menyengsarakan petani lokal.',
      options: ['True (Benar)', 'False (Salah)'],
      correctAnswerIndex: 1,
      explanation: 'Salah. Impor beras CBP dilakukan secara terukur saat cadangan nasional menipis demi menjaga pasok pasar agar harga eceran tidak melambung ekstrem, yang berisiko memicu kelaparan dan menurunkan daya beli jutaan keluarga miskin.',
      illustrationType: 'beras'
    }
  ]
};
